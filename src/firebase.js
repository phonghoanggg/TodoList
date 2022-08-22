// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD8OJIes31qefGFV-G7FlQj1UlolsiQfo",
  authDomain: "app-todolist-1f847.firebaseapp.com",
  databaseURL: "https://app-todolist-1f847-default-rtdb.firebaseio.com",
  projectId: "app-todolist-1f847",
  storageBucket: "app-todolist-1f847.appspot.com",
  messagingSenderId: "21882221580",
  appId: "1:21882221580:web:22fe7bec6fa04e3284aa29",
  measurementId: "G-LTNYCFQTEX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { db };
export default auth;
