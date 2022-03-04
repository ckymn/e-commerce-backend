const admin = require("firebase-admin");
const serviceAccount = require("../key_firebase.json");

const admin_firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const route = async (message, registrationTokens) => {
  admin_firebase
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
    });
};
module.exports = route; 