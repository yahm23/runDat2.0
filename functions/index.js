const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/firebaseAuth');

const {getAllRunningData, postRunningData} = require('./handlers/runningdata.js')
const {signup, login , uploadImage, addUserDetails} =require('./handlers/users'); 




 //Running Data routes
app.get('/runningData', getAllRunningData);
app.post('/runningData',FBAuth, postRunningData);
app.post('/user/image',FBAuth, uploadImage);
app.post('/user',FBAuth, addUserDetails);

//Sign up and login in route:
app.post('/signup',signup);
app.post('/login',login)


exports.api = functions.region('europe-west1').https.onRequest(app);
 