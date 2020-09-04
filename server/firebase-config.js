var admin = require('firebase-admin');

var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://court-queue-prototype.firebaseio.com"
});

module.exports = admin 