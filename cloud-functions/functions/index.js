const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const apiKey = functions.config().api.key;
const apiBody = functions.config().api.body;
const accountNumber = functions.config().account.num;

async function getAccessToken() {
    const url = 'https://oauth.wildapricot.org/auth/token';
    // const encodedApiKey = Buffer.from(apiKey).toString('base64');
    const headers = {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = apiBody;

    const response = await axios.post(url, body, { headers: headers });

    if (response.status !== 200) {
        throw new Error('Failed to get access token');
    }
    
    return response.data.access_token;
}

async function fetchContactsData(accessToken) {
  // Initial request to the contacts endpoint
  let response = await axios.get(`https://api.wildapricot.com/v2.1/accounts/${accountNumber}/contacts`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // Poll the ResultUrl until the Contacts array is not empty
  while (!response.data.Contacts || response.data.Contacts.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 5 seconds before retrying
    response = await axios.get(response.data.ResultUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  return response.data.Contacts; //Returns only the contacts
}

async function acceptTermsOfUse(accessToken) {
  const url = `https://api.wildapricot.com/v2.1/rpc/${accountNumber}/acceptTermsOfUse`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const response = await axios.post(url, {}, { headers: headers });

  if (response.status !== 200) {
    throw new Error('Failed to accept terms of use');
  }

  console.log('Terms of use accepted');
}

app.get('/api/members', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return res.status(500).send('Failed to obtain access token');
    }
    // acceptTermsOfUse(accessToken)

    const contactsData = await fetchContactsData(accessToken);
    
    // console.log("ENDPOINT DATA", contactsData);
    res.json(contactsData);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Server error');
  }
});


exports.WildApricotApi = functions.https.onRequest(app);





// const cors = require("cors")({ origin: true });
const crypto = require("crypto");
// const functions = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

/**
 * General Cloud Function
 */

exports.generalCloudFunction = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      // Parameters found by doing data.parameterName
      // Auth of the user that called the function
      if (
        // Validate parameters here

        // Validate auth
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "" // Desired Role
      ) {
      }
    });
  }
);

/*
 * Creates a new user.
 * Takes an object as a parameter that should contain an email, name, and a role field.
 * This function can only be called by a user with admin status
 * Arguments: email: string, the user's email
 *            name: string, the user's name
 *            role: string, (Options: "ADMIN", "TEACHER")
 */

exports.createUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        // Validate parameters
        // Validate auth and role
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
                // Add to database if needed. Set the fields you want
                const collectionObject = {
                  auth_id: userRecord.uid,
                  email: data.email,
                  name: data.name,
                  type: data.role.toUpperCase(),
                };

                await db
                  .collection("users")
                  .where("auth_id", "==", data.firebase_id)
                  .get()
                  .then(async (querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      await db
                        .collection("users")
                        .add(collectionObject)
                        .then(async () => {
                          resolve({ reason: "Success", text: "Success" });
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
                    } else {
                      // User already in database, so let's just update their fields
                      const doc = querySnapshot[0];
                      await doc.ref
                        .update({
                          /*add the fields you need */
                        })
                        .then(async () => {
                          resolve({ reason: "Success", text: "Success" });
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
                    }
                  })
                  .catch((error) => {
                    reject({
                      reason: "Database Deletion Failed",
                      text: "Unable to find user in the database. Make sure they exist.",
                    });
                    throw new functions.https.HttpsError("unknown", `${error}`);
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
                  reject({
                    reason: "Database Change Failed",
                    text: "User's email has been changed for login, but failed to find user's email within the database.",
                  });
                  throw new functions.https.HttpsError(
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
                      reject({
                        reason: "Database Change Failed",
                        text: "User's email has been changed for login, but failed to find user's email within the database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to change user's email within the database."
                      );
                    });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Change Failed",
                  text: "User's email has been changed for login, but failed to find user's email within the database.",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that email in the database"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Change Failed",
              text: "Failed to change user's email within the login system.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user's email."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "You do not have the correct permissions to update email."
        );
      }
    });
  }
);

/**
 * Changes a user's role in both authorization and the database.
 * Takes an object as a parameter that should contain a firebase_id field and a role field.
 * This function can only be called by a user with admin status
 * Arguments: firebase_id - the id of the user
 *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
 */

exports.setUserRole = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        data.role != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        authorization
          .setCustomUserClaims(data.firebase_id, { role: data.role })
          .then(async () => {
            await db
              .collection("users")
              .where("auth_id", "==", data.firebase_id)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that firebase id in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ type: data.role }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      return { result: "OK" };
                    })
                    .catch(() => {
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Unable to update user role in database"
                      );
                    });
                }
              })
              .catch((error) => {
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that firebase id in the database"
                );
              });
          })
          .catch((error) => {
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user role."
            );
          });
      } else {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
        );
      }
    });
  }
);
