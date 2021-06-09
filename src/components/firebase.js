// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase/app';
let firebaseui = require('firebaseui');

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

  var ui = new firebaseui.auth.AuthUI(firebase.auth())

  export default ui;