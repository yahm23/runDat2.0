const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/firebaseAuth');

const {getAllRunningData, postRunningData} = require('./handlers/runningdata.js')
const {signup, login,uploadImage} =require('./handlers/users'); 



//Running Data routes
app.get('/runningData', getAllRunningData);
app.post('/runningData',FBAuth, postRunningData);

//Sign up and login in route:
app.post('/signup',signup);
app.post('/login',login)

app.post('/iusers/image',FBAuth, uploadImage);

exports.api = functions.region('europe-west1').https.onRequest(app);
 