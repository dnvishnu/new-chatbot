"use client"
import { useState } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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

// Initialize Firebase with the config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the Auth instance from Firebase

const provider = new GoogleAuthProvider();

const SignInButton = () => {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;  // Signed-in user info
      console.log('User logged in:', user);
      setUser(user); // Save user data to state

      // You can also access the Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log('Access Token:', token);
    } catch (error) {
      console.error('Error during sign-in:', error.code, error.message);
      // Handle specific errors (popup blocked, user already signed in, etc.)
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>

      {/* Display user info if logged in */}
      {user && (
        <div>
          <p>User logged in: {user.displayName}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
