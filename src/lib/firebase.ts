import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFPmo_oNTgn5fh5UEgDE6u8v3S9lK5III",
  authDomain: "tikflow-3f0dd.firebaseapp.com",
  projectId: "tikflow-3f0dd",
  storageBucket: "tikflow-3f0dd.firebasestorage.app",
  messagingSenderId: "100478259542",
  appId: "1:100478259542:web:05eccc73f55ea5db11c6f7",
  measurementId: "G-16625FJVP8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
