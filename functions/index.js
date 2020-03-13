const functions = require('firebase-functions');
// const admin = require('firebase-admin')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var admin = require("firebase-admin");

var serviceAccount = require("../runDatSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rundat-e0a41.firebaseio.com"
});


exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from world!");
});

exports.getRunningData = functions.https.onRequest((request, response) => {
    admin.firestore().collection('runningData').get()
    .then(data =>{
        let runningData=[];
        data.forEach(doc => {
            runningData.push(doc.data());
        })
        return response.json(runningData);
    })
    .catch(err=>console.error(err));
});

exports.createRunningData= functions.https.onRequest((request, response) => {
   const newRunningData={
       DistanceKm:request.body.DistanceKm,
       Time:request.body.Time,
       userHandle:request.body.userHandle
   };
   
    admin    
    .firestore()
    .collection('runningData')
    .add(newRunningData)
    .then((doc) =>{
        response.json({message:`document ${doc.id} created successfully`});
    })
    .catch(err=>{
        response.status(500).json({error:`${request.body.DistanceKm} if exists, still error`});
        console.error(err);
    });
});
 