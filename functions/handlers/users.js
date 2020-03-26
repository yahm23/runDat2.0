const {admin, db}= require('../util/admin');
const config = require('../util/config.js'); 
const firebase =require('firebase');
firebase.initializeApp(config);

const {validateSignUpData, validateLoginData}= require('../util/validators')


exports.signup=(req,res)=>{
    const newUser={
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        userName:req.body.userName
    };

    const {valid,errors}= validateSignUpData(newUser);
    if(!valid) return res.status(400).json(errors);

    const noImg= 'no-img.png'

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
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
}

exports.login=(req,res)=>{
    const user ={
        email: req.body.email,
        password: req.body.password
    };

    const {valid,errors}= validateLoginData(user)
    if(!valid) return res.status(400).json(errors);


    
    
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
}

exports.uploadImage =(req, res)=>{
    const BusBoy= require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({headers: req.headers});
    let imageToBeUploaded={}

    busboy.on('file',(fieldname,file,filename,encoding,mimetype)=>{
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);

        const imageExtension =  filename.split('.')[filename.split('.').length-1];
        

        imageFileName = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on('finish', ()=>{
        admin.storage().bucket().upload(imageToBeUploaded.filePath,{
            resumable:false,
            metadata:{
                metadata:{
                contentType:imageToBeUploaded.mimetype
            }}
        })

        .then(()=>{
            const imageUrl =`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({imageUrl});

        })
        .then(()=>{
            return res.json({message: 'image uploaded succesfully'})
        })
        .catch(err =>{
            console.log(err);
            return res.status(500).json({error:err.code});
        })
    })
}