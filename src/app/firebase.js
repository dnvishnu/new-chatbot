// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACU3aPjBaQHgIk1M7O457YteYN5mYW27g",
  authDomain: "kreatewebsite-new-template.firebaseapp.com",
  projectId: "kreatewebsite-new-template",
  storageBucket: "kreatewebsite-new-template.appspot.com",
  messagingSenderId: "988959267955",
  appId: "1:988959267955:web:abaa1ec3024f81c78d9e06",
  measurementId: "G-ET064B0ZTC",
  databaseURL: "https://kreatewebsite-new-template-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };
