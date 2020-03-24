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
const db = admin.firestore();

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
    db.collection('runningData').get()
    .then(data =>{
        let runningData=[];
        data.forEach(doc => {
            runningData.push({
                dataId: doc.id,
                userName: doc.data().userName,
                DistanceKm:doc.data().DistanceKm,
                DateRecorded: new Date().toISOString(),
                Time:doc.data().Time
            });
        })
        return res.json(runningData);
    })
    .catch(err=>console.error(err));
});

const FBAuth = (req,res, next)=>{
    let idToken;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else{
        console.error('No token found')
        return res.status(403).json({error:'Unauthorized access'})
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken =>{
        req.user = decodedToken;
        console.log(decodedToken);
         return db.collection('usersIDs')
         .where('userId','==',req.user.uid)
         .limit(1)
         .get();
    })
    .then(data =>{
        req.user.userName = data.docs[0].data().userName;
        return next();
    })
    .catch(err=>{
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    })
}

//Post Runnning data 
app.post('/runningData',FBAuth, (req, res) => {
   const newRunningData={
       DistanceKm:req.body.DistanceKm,
       Time:req.body.Time,
       userName:req.user.userName,
       DateRecorded: new Date().toISOString()
   };
   
    db
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
//Checking methods:
const emailValidCheck=(email)=>{
    const regEmailExpression =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEmailExpression)) return true;
    else return false;
}

const emptyCheck=(input)=>{
    if(input.trim()===''){return true}
    else{return false}
}

//Sign up route:
app.post('/signup', (req,res)=>{
    const newUser={
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        userName:req.body.userName
    };

    //Checking input of new user 
    let errors = {};


    if(emptyCheck(newUser.email)){
        errors.email = 'Email must not be empty';
    } else if(!emailValidCheck(newUser.email)){
        errors.email = 'Must be a valid email address';
    }
    if(emptyCheck(newUser.password)) errors.password='Password must not be empty';
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(emptyCheck(newUser.userName)) errors.userName='User Name must not be emmpty';

    if(Object.keys(errors).length>0) return res.status(400).json(errors);


    let token, userId;
    db.doc(`/usersIDs/${newUser.userName}`).get()
    .then(doc =>{
        if (doc.exists){
            return res.status(400).json({userName:'This username is already taken'})
        }
        else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken =>{
        token = idToken;
        const userCreds = {
            userName : newUser.userName,
            email : newUser.email,
            createdAt : new Date().toISOString(),
            userId
        }
        return db.doc(`/usersIDs/${newUser.userName}`).set(userCreds)
    })
    .then(()=>{
        return res.status(201).json({token});
    })

    .catch(err=>{
        console.error(err);
        if (err.code ==='"auth/email-already-in-use'){
            return res.status(400).json({email:'Email is already in use'})
        } else{ }
    });
});

app.post('/login',(req,res)=>{
    const user ={
        email: req.body.email,
        password: req.body.password
    };

    let errors={};
    if(emptyCheck(user.email)) errors.email = 'Email must not be empty';
    if(emptyCheck(user.password))errors.password = ' password must not be empty';
    if(Object.keys(errors).length > 0) return res.status(400).json(errors);
    
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then( (data) =>{
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code==="auth/wrong-password"){
            return res.status(403).json({general:'Wrong password or username, please try again'})
        } else
            return res.status(500).json({error: err.code})}
    )
})

exports.api = functions.region('europe-west1').https.onRequest(app);
 