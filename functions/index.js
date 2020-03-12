const functions = require('firebase-functions');
const admin = require('firebase-admin')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp();
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from world!");
});

exports.getRunningDistanceKM = functions.https.onRequest((request, response) => {
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
