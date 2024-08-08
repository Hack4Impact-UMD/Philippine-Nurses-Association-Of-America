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
  // Get the date from a week ago
  const lastWeek = new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)
    .toISOString()
    .split("T")[0]; // Get the current date in the format YYYY-MM-DD

  const url =
    new Date().getDay() == 7
      ? `https://api.wildapricot.com/v2.1/accounts/${accountId}/contacts`
      : `https://api.wildapricot.com/v2.1/accounts/${accountId}/contacts?$filter=LastUpdated gt ${lastWeek}`;
  // Initial request to the contacts endpoint
  let response = await axios.get(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });

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
      let processedData = null;
      // Once a week, clear the entire chapters collection and fetch
      // it all again in order to account for deleted contacts
      if (new Date().getDay() == 7) {
        processedData = helperFunctions.processWeeklyMembershipData(
          db,
          cleanedData
        );
      } else {
        processedData = helperFunctions.processMembershipData(db, cleanedData);
      }

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

exports.updateMembers = onSchedule(
  {
    schedule: "every day 01:00",
    region: "us-east4",
    timeoutSeconds: 1200, // Increase timeout to 9 minutes
    memory: "2GiB", // Optionally increase the memory allocation if needed
    timeZone: "America/New_York",
  },
  async (event) => {
    try {
      const tempDataCollection = db.collection("chapters");
      const snapshot = await tempDataCollection.get();
      const chapterInfo = {};
      snapshot.forEach((doc) => {
        chapterInfo[doc.id] = doc.data();
      });
      Object.keys(chapterInfo).forEach((key) => {
        const chapter = chapterInfo[key];
        const chapterMembers = chapter.members;
        let totalActive = 0;
        let totalLapsed = 0;
        const today = new Date().toISOString().split("T")[0];
        chapterMembers.forEach((member, index) => {
          if (member.renewalDueDate == "N/A") {
            totalLapsed += 1;
            return;
          }
          const isActive = member.renewalDueDate >= today;
          chapter.members[index].activeStatus = isActive ? "Active" : "Lapsed";
          if (isActive) {
            totalActive += 1;
          } else {
            totalLapsed += 1;
          }
        });
        chapter.totalActive = totalActive;
        chapter.totalLapsed = totalLapsed;
        chapterInfo[key] = chapter;
      });
      const batch = db.batch();
      Object.entries(chapterInfo).forEach(([key, data], index) => {
        const docRef = tempDataCollection.doc(key); // Use chapter name or a unique key as the document ID
        batch.set(docRef, data);
      });

      await batch.commit();
    } catch (error) {
      functions.logger.log("Error while updating chapter data: ", error);
    }
  }
);

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

/**
 * Updates a user's email
 * Arguments: email - the user's current email
 *            newEmail - the user's new email
 * TODO: Update Error Codes
 */

exports.updateUserEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.newEmail != null &&
        auth &&
        auth.token &&
        auth.token.email.toLowerCase() == data.email.toLowerCase()
      ) {
        await authorization
          .updateUser(auth.uid, {
            email: data.newEmail,
          })
          .then(async () => {
            await db
              .collection("users")
              .where("auth_id", "==", auth.uid)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  reject(
                    new functions.https.HttpsError(
                      "unknown",
                      "Unable to find user with that email in the database"
                    )
                  );
                  functions.logger.error(
                    "Unknown",
                    "Unable to find user with that email in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ email: data.newEmail }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      resolve({
                        reason: "Success",
                        text: "Successfully changed email.",
                      });
                    })
                    .catch(() => {
                      reject(
                        new functions.https.HttpsError(
                          "unknown",
                          "Failed to change user's email within the database."
                        )
                      );
                      functions.logger.error(
                        "Unknown",
                        "Failed to change user's email within the database."
                      );
                    });
                }
              })
              .catch((error) => {
                reject(
                  new functions.https.HttpsError(
                    "unknown",
                    "Unable to find user with that email in the database"
                  )
                );
                functions.logger.error(
                  "Unknown",
                  "Unable to find user with that email in the database"
                );
              });
          })
          .catch((error) => {
            reject(
              new functions.https.HttpsError(
                "unknown",
                "Failed to change user's email."
              )
            );
            functions.logger.error("Unknown", "Failed to change user's email.");
          });
      } else {
        reject(
          new functions.https.HttpsError(
            "unknown",
            "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use."
          )
        );
        functions.logger.error(
          "unknown",
          "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use."
        );
      }
    });
  }
);

/**
 * Let's a user delete themselves
 * Argument: firebase_id - the user's firebase_id
 */

exports.deleteSelf = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        auth &&
        auth.uid &&
        auth.uid == data.firebase_id &&
        (auth.token.role.toLowerCase() == "admin" ||
          auth.token.role.toLowerCase() == "user")
      ) {
        const promises = [];
        await db
          .collection("users")
          .where("auth_id", "==", data.firebase_id)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.docs.length == 0) {
              reject(
                new functions.https.HttpsError(
                  "unknown",
                  "Unable to find you in the database"
                )
              );
              new functions.logger.error(
                "unknown",
                "Unable to find you in the database"
              );
            } else {
              querySnapshot.forEach((documentSnapshot) => {
                promises.push(documentSnapshot.ref.delete());
              });
            }
          })
          .catch((error) => {
            reject(new functions.https.HttpsError("unknown", `${error}`));
            functions.logger.error("unknown", `${error}`);
          });
        await Promise.all(promises)
          .then(async () => {
            await authorization
              .deleteUser(data.firebase_id)
              .then(async () => {
                resolve();
              })
              .catch((error) => {
                reject(
                  new functions.https.HttpsError(
                    "unknown",
                    "Unable to delete user."
                  )
                );
                functions.logger.error("Unknown", "Unable to delete user.");
              });
          })
          .catch((error) => {
            reject(new functions.https.HttpsError("unknown", `${error}`));
            functions.logger.error("unknown", `${error}`);
          });
      } else {
        reject(
          new functions.https.HttpsError(
            "unknown",
            "Make sure you have the correct permissions to delete this account."
          )
        );
        functions.logger.error(
          "unknown",
          "Make sure you have the correct permissions to delete this account."
        );
      }
    });
  }
);
