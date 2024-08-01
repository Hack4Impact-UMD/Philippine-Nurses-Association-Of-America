const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const axios = require("axios");
const { onCall } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const helperFunctions = require("./helperFunctions");
const serviceAccount = require("./serviceAccount.json");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const apiKey = process.env.APIKEY;
const body = process.env.BODY;
const accountId = process.env.ACCOUNTID;

async function getAccessToken() {
  const url = "https://oauth.wildapricot.org/auth/token";

  const response = await axios
    .post(url, body, {
      headers: {
        "Authorization": `Basic ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .catch((error) => {
      console.log(error);
    });

  if (response.status !== 200) {
    throw new Error("Failed to get access token");
  }

  return response.data.access_token;
}

async function fetchContactsData(accessToken) {
  // Initial request to the contacts endpoint
  let response = await axios.get(
    `https://api.wildapricot.com/v2.1/accounts/${accountId}/contacts`,
    {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );

  // Poll the ResultUrl until the Contacts array is not empty
  while (!response.data.Contacts || response.data.Contacts.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 5001)); // Wait for 5 seconds before retrying
    response = await axios.get(response.data.ResultUrl, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  }

  return response.data.Contacts; //Returns only the contacts
}

exports.fetchChapterData = onSchedule(
  {
    schedule: "every day 00:00",
    region: "us-east4",
    timeoutSeconds: 1200, // Increase timeout to 9 minutes
    memory: "2GiB", // Optionally increase the memory allocation if needed
    timeZone: "America/New_York",
  },
  async (event) => {
    try {
      const accessToken = await getAccessToken();
      console.log("Obtained access token");
      const contactsData = await fetchContactsData(accessToken);
      console.log("Fetched contact data");
      const cleanedData = helperFunctions.cleanData(contactsData);
      const processedData = helperFunctions.processMembershipData(
        db,
        cleanedData
      );
      await helperFunctions.storeProcessedData(db, processedData);
      console.log("Stored contact data");
    } catch (error) {
      functions.logger.log("Error while fetching chapter data: ", error);
    }
  }
);

async function fetchEvents(accessToken) {
  let response = await axios.get(
    `https://api.wildapricot.com/v2.1/accounts/${accountId}/events`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.Events; //Returns only the contacts
}

exports.fetchEventData = onSchedule(
  {
    schedule: "every day 00:00",
    region: "us-east4",
    timeoutSeconds: 1200, // Increase timeout to 9 minutes
    memory: "2GB", // Optionally increase the memory allocation if needed
    timeZone: "America/New_York",
  },
  async (event) => {
    try {
      const accessToken = await getAccessToken();
      const eventData = await fetchEvents(accessToken);
      const cleanedData = helperFunctions.cleanEventData(eventData);

      const processedData = helperFunctions.processEventData(cleanedData);

      await helperFunctions.storeEventData(db, processedData);
    } catch (error) {
      console.error("Error while fetching event data:", error);
    }
  }
);

// exports.generalCloudFunction = onCall(
//   { region: "us-east4", cors: true },
//   async ({ auth, data }) => {
//     return new Promise(async (resolve, reject) => {
//       // Parameters found by doing data.parameterName
//       // Auth of the user that called the function
//       if (
//         // Validate parameters here

//         // Validate auth
//         auth &&
//         auth.token &&
//         auth.token.role.toLowerCase() == "" // Desired Role
//       ) {
//       }
//     });
//   }
// );

/*
 * Creates a new user.
 * Takes an object as a parameter that should contain an email, name, chapterName and a role field.
 * This function can only be called by a user with admin status
 * Arguments: email: string, the user's email
 *            name: string, the user's name
 *            chapterName: string, the user's chapter name
 *            role: string, (Options: "ADMIN", "TEACHER")
 */

exports.createUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.role != null &&
        data.name != null &&
        data.chapterName != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        const pass = crypto.randomBytes(32).toString("hex");
        await authorization
          .createUser({
            email: data.email,
            password: pass,
          })
          .then(async (userRecord) => {
            await authorization
              .setCustomUserClaims(userRecord.uid, {
                role: data.role,
              })
              .then(async () => {
                const collectionObject = {
                  auth_id: userRecord.uid,
                  email: data.email,
                  name: data.name,
                  chapterName: data.chapterName,
                  type: data.role.toUpperCase(),
                };
                await db
                  .collection("users")
                  .doc(userRecord.uid)
                  .set(collectionObject)
                  .then(async () => {
                    resolve();
                  })
                  .catch((error) => {
                    reject({
                      reason: "Database Add Failed",
                      text: "User has been created in login, but has not been added to database.",
                    });
                    throw new functions.https.HttpsError(
                      "Unknown",
                      "Failed to add user to database"
                    );
                  });
              })
              .catch((error) => {
                reject({
                  reason: "Role Set Failed",
                  text: "User has been created, but their role was not set properly",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to set user's role"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Creation Failed",
              text: "Failed to create user. Please make sure the email is not already in use.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to create user in the auth."
            );
          });
      } else {
        reject({
          reason: "Permission Denied",
          text: "Only an admin user can create users. If you are an admin, make sure the email and name passed in are correct.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can create users. If you are an admin, make sure the email and name passed into the function are correct."
        );
      }
    });
  }
);

/**
 * Deletes the user
 * Argument: firebase_id - the user's firebase_id
 */

exports.deleteUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        await authorization
          .deleteUser(data.firebase_id)
          .then(async () => {
            const promises = [];
            await db
              .collection("users")
              .where("auth_id", "==", data.firebase_id)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that firebase id in the database"
                  );
                } else {
                  querySnapshot.forEach((documentSnapshot) => {
                    promises.push(documentSnapshot.ref.delete());
                  });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to find user in the database. Make sure they exist.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
            await Promise.all(promises)
              .then(() => {
                resolve({ reason: "Success", text: "Success" });
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to delete user from the database.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Deletion Failed",
              text: "Unable to delete user from login system. Make sure they exist.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Unable to delete user."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "Only an admin user can delete users. If you are an admin, make sure the account exists.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can delete users. If you are an admin, make sure the account exists."
        );
      }
    });
  }
);

// /**
//  * Deletes the user
//  * Argument: firebase_id - the user's firebase_id
//  */

// exports.deleteUser = onCall(
//   { region: "us-east4", cors: true },
//   async ({ auth, data }) => {
//     return new Promise(async (resolve, reject) => {
//       const authorization = admin.auth();
//       if (
//         data.firebase_id != null &&
//         auth &&
//         auth.token &&
//         auth.token.role.toLowerCase() == "admin"
//       ) {
//         await authorization
//           .deleteUser(data.firebase_id)
//           .then(async () => {
//             const promises = [];
//             await db
//               .collection("users")
//               .where("auth_id", "==", data.firebase_id)
//               .get()
//               .then((querySnapshot) => {
//                 if (querySnapshot.docs.length == 0) {
//                   throw new functions.https.HttpsError(
//                     "Unknown",
//                     "Unable to find user with that firebase id in the database"
//                   );
//                 } else {
//                   querySnapshot.forEach((documentSnapshot) => {
//                     promises.push(documentSnapshot.ref.delete());
//                   });
//                 }
//               })
//               .catch((error) => {
//                 reject({
//                   reason: "Database Deletion Failed",
//                   text: "Unable to find user in the database. Make sure they exist.",
//                 });
//                 throw new functions.https.HttpsError("unknown", `${error}`);
//               });
//             await Promise.all(promises)
//               .then(() => {
//                 resolve({ reason: "Success", text: "Success" });
//               })
//               .catch((error) => {
//                 reject({
//                   reason: "Database Deletion Failed",
//                   text: "Unable to delete user from the database.",
//                 });
//                 throw new functions.https.HttpsError("unknown", `${error}`);
//               });
//           })
//           .catch((error) => {
//             reject({
//               reason: "Auth Deletion Failed",
//               text: "Unable to delete user from login system. Make sure they exist.",
//             });
//             throw new functions.https.HttpsError(
//               "Unknown",
//               "Unable to delete user."
//             );
//           });
//       } else {
//         reject({
//           reason: "Permissions",
//           text: "Only an admin user can delete users. If you are an admin, make sure the account exists.",
//         });
//         throw new functions.https.HttpsError(
//           "permission-denied",
//           "Only an admin user can delete users. If you are an admin, make sure the account exists."
//         );
//       }
//     });
//   }
// );
// /**
//  * Updates a user's email
//  * Arguments: email - the user's current email
//  *            newEmail - the user's new email
//  * TODO: Update Error Codes
//  */

// exports.updateUserEmail = onCall(
//   { region: "us-east4", cors: true },
//   async ({ auth, data }) => {
//     return new Promise(async (resolve, reject) => {
//       const authorization = admin.auth();
//       if (
//         data.email != null &&
//         data.newEmail != null &&
//         auth &&
//         auth.token &&
//         auth.token.email.toLowerCase() == data.email.toLowerCase()
//       ) {
//         await authorization
//           .updateUser(auth.uid, {
//             email: data.newEmail,
//           })
//           .then(async () => {
//             await db
//               .collection("users")
//               .where("auth_id", "==", auth.uid)
//               .get()
//               .then(async (querySnapshot) => {
//                 if (querySnapshot.docs.length == 0) {
//                   reject({
//                     reason: "Database Change Failed",
//                     text: "User's email has been changed for login, but failed to find user's email within the database.",
//                   });
//                   throw new functions.https.HttpsError(
//                     "Unknown",
//                     "Unable to find user with that email in the database"
//                   );
//                 } else {
//                   const promises = [];
//                   querySnapshot.forEach((doc) => {
//                     promises.push(doc.ref.update({ email: data.newEmail }));
//                   });
//                   await Promise.all(promises)
//                     .then(() => {
//                       resolve({
//                         reason: "Success",
//                         text: "Successfully changed email.",
//                       });
//                     })
//                     .catch(() => {
//                       reject({
//                         reason: "Database Change Failed",
//                         text: "User's email has been changed for login, but failed to find user's email within the database.",
//                       });
//                       throw new functions.https.HttpsError(
//                         "Unknown",
//                         "Failed to change user's email within the database."
//                       );
//                     });
//                 }
//               })
//               .catch((error) => {
//                 reject({
//                   reason: "Database Change Failed",
//                   text: "User's email has been changed for login, but failed to find user's email within the database.",
//                 });
//                 throw new functions.https.HttpsError(
//                   "Unknown",
//                   "Unable to find user with that email in the database"
//                 );
//               });
//           })
//           .catch((error) => {
//             reject({
//               reason: "Auth Change Failed",
//               text: "Failed to change user's email within the login system.",
//             });
//             throw new functions.https.HttpsError(
//               "Unknown",
//               "Failed to change user's email."
//             );
//           });
//       } else {
//         reject({
//           reason: "Permissions",
//           text: "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use.",
//         });
//         throw new functions.https.HttpsError(
//           "permission-denied",
//           "You do not have the correct permissions to update email."
//         );
//       }
//     });
//   }
// );

// /**
//  * Changes a user's role in both authorization and the database.
//  * Takes an object as a parameter that should contain a firebase_id field and a role field.
//  * This function can only be called by a user with admin status
//  * Arguments: firebase_id - the id of the user
//  *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
//  */

// exports.setUserRole = onCall(
//   { region: "us-east4", cors: true },
//   async ({ auth, data }) => {
//     return new Promise(async (resolve, reject) => {
//       const authorization = admin.auth();
//       if (
//         data.firebase_id != null &&
//         data.role != null &&
//         auth &&
//         auth.token &&
//         auth.token.role.toLowerCase() == "admin"
//       ) {
//         authorization
//           .setCustomUserClaims(data.firebase_id, { role: data.role })
//           .then(async () => {
//             await db
//               .collection("users")
//               .where("auth_id", "==", data.firebase_id)
//               .get()
//               .then(async (querySnapshot) => {
//                 if (querySnapshot.docs.length == 0) {
//                   throw new functions.https.HttpsError(
//                     "Unknown",
//                     "Unable to find user with that firebase id in the database"
//                   );
//                 } else {
//                   const promises = [];
//                   querySnapshot.forEach((doc) => {
//                     promises.push(doc.ref.update({ type: data.role }));
//                   });
//                   await Promise.all(promises)
//                     .then(() => {
//                       return { result: "OK" };
//                     })
//                     .catch(() => {
//                       throw new functions.https.HttpsError(
//                         "Unknown",
//                         "Unable to update user role in database"
//                       );
//                     });
//                 }
//               })
//               .catch((error) => {
//                 throw new functions.https.HttpsError(
//                   "Unknown",
//                   "Unable to find user with that firebase id in the database"
//                 );
//               });
//           })
//           .catch((error) => {
//             throw new functions.https.HttpsError(
//               "Unknown",
//               "Failed to change user role."
//             );
//           });
//       } else {
//         throw new functions.https.HttpsError(
//           "permission-denied",
//           "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
//         );
//       }
//     });
//   }
// );
