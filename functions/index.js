// const firebaseConfig = require('../config.js')
const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./runDatSDK.json");
const app = require('express')();
require('dotenv').config({ path: '../config.env' });


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rundat-e0a41.firebaseio.com"
});
const firebase = require('firebase');

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId:process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASURE_ID 
  };

firebase.initializeApp(config);


app.get('/runningData', (req,res)=>{
    admin.firestore().collection('runningData').get()
    .then(data =>{
        let runningData=[];
        data.forEach(doc => {
            runningData.push({
                dataId: doc.id,
                userHandle: doc.data().userHandle,
                DistanceKm:doc.data().DistanceKm,
                DateRecorded: new Date().toISOString(),
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
        res.json({message:`document ${doc.id} created successfully ${process.env.REACT_APP_API_KEY}`});
    })
    .catch(err=>{
        res.status(500).json({error:`Internal server error`});
        console.error(err);
    });
});

//Sign up route:
app.post('/signup', (req,res)=>{
    const newUser={
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        handle:req.body.handle
    };
    firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
    .then(data=> {
        return res.status(201).json({message:`user ${data.user.uid} has been signed up`})
    })
    .catch(err=>{
        console.error(err);
        res.status(500).json({error: err.code});
    });
})

exports.api = functions.region('europe-west1').https.onRequest(app);
 