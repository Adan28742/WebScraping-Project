// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCejZWLkZJVQVz-gC_Iiq7uA7k4JSJ7Bmw",
  authDomain: "project-management-abec4.firebaseapp.com",
  projectId: "project-management-abec4",
  storageBucket: "project-management-abec4.firebasestorage.app",
  messagingSenderId: "677978587597",
  appId: "1:677978587597:web:3ebcbbe9cfd2006be70484",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = getAuth(app);
