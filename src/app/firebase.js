// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDEVtIfbNs3txpoPMCjSnbLi3TDnsJuWk",
  authDomain: "sakura-vote.firebaseapp.com",
  projectId: "sakura-vote",
  storageBucket: "sakura-vote.appspot.com",
  messagingSenderId: "175901618612",
  appId: "1:175901618612:web:428770376c2ec67eb182e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
