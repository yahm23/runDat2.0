import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAPxyOth-0zQwb5Xp_8Jz7KuQxNe_Zm92U",
    authDomain: "rundat-e0a41.firebaseapp.com",
    databaseURL: "https://rundat-e0a41.firebaseio.com",
    projectId: "rundat-e0a41",
    storageBucket: "rundat-e0a41.appspot.com",
    messagingSenderId: "101147585416",
    appId: "1:101147585416:web:26f6bb0c3143b3974a283d",
    measurementId: "G-YL5G1WDK5H"
  };
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
