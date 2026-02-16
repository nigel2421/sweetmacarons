
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth"; // Import providers
import { getFunctions } from "firebase/functions"; // Import getFunctions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqdmuPVTlDAqNA5PvQtS5uckX-W1cdm_8",
  authDomain: "lostresmacarons-2421.firebaseapp.com",
  projectId: "lostresmacarons-2421",
  storageBucket: "lostresmacarons-2421.appspot.com",
  messagingSenderId: "161079678038",
  appId: "1:161079678038:web:54dca6816404da20add7f7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize and export auth
const functions = getFunctions(app); // Initialize functions
setPersistence(auth, browserLocalPersistence);

// Initialize providers
const googleProvider = new GoogleAuthProvider();

// Function to get reviews for a specific product
const getReviews = async (productId) => {
  const q = query(collection(db, "reviews"), where("productId", "==", productId));
  const querySnapshot = await getDocs(q);
  const reviews = [];
  querySnapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  return reviews;
};

// Function to add a new review
const addReview = async (review) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), review);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

export { db, auth, functions, googleProvider, getReviews, addReview }; // Export auth, functions and providers
