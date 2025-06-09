// src/utils/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7JHQAt-RAXfpuQBCFqcNOA9PzHV2DCI4",
  authDomain: "deeplearn-app.firebaseapp.com",
  projectId: "deeplearn-app",
  storageBucket: "deeplearn-app.appspot.com",
  messagingSenderId: "83811699934",
  appId: "1:83811699934:web:952243386f4a65ad9c864f",
  measurementId: "G-DG32B1CT81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB
const db = getFirestore(app);

// Analytics (optional)
let analytics = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { app, db, analytics };
export default firebaseConfig;
