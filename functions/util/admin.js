var admin = require("firebase-admin");
var serviceAccount = require("../runDatSDK.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rundat-e0a41.firebaseio.com"
  });

const db = admin.firestore();

module.exports ={admin,db}
