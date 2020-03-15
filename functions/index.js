const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./runDatSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rundat-e0a41.firebaseio.com"
});

const express = require('express');
const app = express();


app.get('/runningData', (req,res)=>{
    admin.firestore().collection('runningData').get()
    .then(data =>{
        let runningData=[];
        data.forEach(doc => {
            runningData.push({
                dataId: doc.id,
                userHandle: doc.data().userHandle,
                DistanceKm:doc.data().DistanceKm,
                DateRecorded: doc.data().DateRecorded,
                Time:doc.data().Time
            });
        })
        return res.json(runningData);
    })
    .catch(err=>console.error(err));
});


app.post('/runningData',(req, res) => {
   const newRunningData={
       DistanceKm:req.body.DistanceKm,
       Time:req.body.Time,
       userHandle:req.body.userHandle,
       DateRecorded: new Date().toISOString()

   };
   
    admin    
    .firestore()
    .collection('runningData')
    .add(newRunningData)
    .then((doc) =>{
        res.json({message:`document ${doc.id} created successfully`});
    })
    .catch(err=>{
        res.status(500).json({error:`Internal server error`});
        console.error(err);
    });
});

exports.api = functions.https.onRequest(app);
 