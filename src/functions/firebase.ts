// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCqQ6bVUCmgL9gCCOBRejwxM2p8kgvC1AY",

  authDomain: "notodev-6499b.firebaseapp.com",

  projectId: "notodev-6499b",

  storageBucket: "notodev-6499b.appspot.com",

  messagingSenderId: "700309997471",

  appId: "1:700309997471:web:3230eb0182a254b06c5faa",

  measurementId: "G-0166JE2RM9"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {app, db}
