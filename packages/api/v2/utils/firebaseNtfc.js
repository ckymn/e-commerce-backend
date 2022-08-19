const admin = require("firebase-admin");
const serviceAccount = require("../key_firebasee.json");

const admin_firebase = admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // NOW THIS WORKS!!!
  }),
});

const route = async (message, registrationTokens) => {
  return admin_firebase
    .messaging()
    .sendMulticast(message)
    .then((response) => {
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
      return {
        message: response.successCount + " messages were sent successfully",
        data: response.responses,
      };
    });
};
module.exports = route;
