// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTsNS2jHpFuznTk8U5Y_1k3ided1WIRaY",
  authDomain: "personal-d6fe7.firebaseapp.com",
  projectId: "personal-d6fe7",
  storageBucket: "personal-d6fe7.firebasestorage.app",
  messagingSenderId: "430243430713",
  appId: "1:430243430713:web:eb4a4451b38944eb5ae8e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();