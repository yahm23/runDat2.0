const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("../runDatSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rundat-e0a41.firebaseio.com"
});

const express = require('express');
const app = express();




exports.getRunningData = functions.https.onRequest((req, res) => {
    admin.firestore().collection('runningData').get()
    .then(data =>{
        let runningData=[];
        data.forEach(doc => {
            runningData.push(doc.data());
        })
        return res.json(runningData);
    })
    .catch(err=>console.error(err));
});

exports.createRunningData= functions.https.onRequest((req, res) => {
   const newRunningData={
       DistanceKm:req.body.DistanceKm,
       Time:req.body.Time,
       userHandle:req.body.userHandle
   };
   
    admin    
    .firestore()
    .collection('runningData')
    .add(newRunningData)
    .then((doc) =>{
        res.json({message:`document ${doc.id} created successfully`});
    })
    .catch(err=>{
        res.status(500).json({error:`${req.body.DistanceKm} if exists, still error`});
        console.error(err);
    });
});
 