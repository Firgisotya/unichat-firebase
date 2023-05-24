import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp({
    apiKey: "AIzaSyANYcu_MYzG39YXPrIa9Qd1YmuB1pxcA1w",
    authDomain: "unichat-971f5.firebaseapp.com",
    projectId: "unichat-971f5",
    storageBucket: "unichat-971f5.appspot.com",
    messagingSenderId: "463365036478",
    appId: "1:463365036478:web:b10ae487e3c8fff716c1ef"
  }).auth();