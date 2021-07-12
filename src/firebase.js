import firebase from 'firebase';

var firebaseui = require('firebaseui');


const firebaseConfig = {
    apiKey: "AIzaSyDYJt2fkVjwMo0BY4hIOdnR4sUKAX2QELw",
    authDomain: "bookexchangeclub-0510.firebaseapp.com",
    projectId: "bookexchangeclub-0510",
    storageBucket: "bookexchangeclub-0510.appspot.com",
    messagingSenderId: "61646628202",
    appId: "1:61646628202:web:c5a8348c95890eb3dfb113",
    measurementId: "G-ZGY6N1LT65"
};

firebase.initializeApp(firebaseConfig);

export var db = firebase.firestore();

export var ui = new firebaseui.auth.AuthUI(firebase.auth());