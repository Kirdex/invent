// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKbxSCC7ejcwEshBLHaHDlJeqLd3eIub0",
  authDomain: "inventorymanagement-237fb.firebaseapp.com",
  projectId: "inventorymanagement-237fb",
  storageBucket: "inventorymanagement-237fb.appspot.com",
  messagingSenderId: "775221284506",
  appId: "1:775221284506:web:b5827decace0d871515923",
  measurementId: "G-0H51MCH1XT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore};