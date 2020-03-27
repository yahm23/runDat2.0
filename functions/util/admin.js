var admin = require("firebase-admin");
var serviceAccount = require("../runDatSDK.json");
const config = require('./config.js'); 



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rundat-e0a41.firebaseio.com",
    storageBucket: config.storageBucket
  });

var bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports ={admin,db, bucket}
