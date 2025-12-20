// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add your own Firebase configuration from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBqdmuPVTlDAqNA5PvQtS5uckX-W1cdm_8",
  authDomain: "lostresmacarons-2421.firebaseapp.com",
  projectId: "lostresmacarons-2421",
  storageBucket: "lostresmacarons-2421.firebasestorage.app",
  messagingSenderId: "161079678038",
  appId: "1:161079678038:web:54dca6816404da20add7f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
