// Import the functions you need from the SDKs you need
import { getStorage } from "@firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  memoryLocalCache,
  memoryLruGarbageCollector,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAef0b2KDrdWCcKJBmOW88PX4FZLtrn8Co",
  authDomain: "pnaa-8b56f.firebaseapp.com",
  projectId: "pnaa-8b56f",
  storageBucket: "pnaa-8b56f.appspot.com",
  messagingSenderId: "1072615861967",
  appId: "1:1072615861967:web:8ed5ad49a18b5a2b0651ba",
  measurementId: "G-HW8Z1LHJSM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initializes a cache. Cache is cleared when page is refreshed, but not when using the navbar
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache({
    garbageCollector: memoryLruGarbageCollector(),
  }),
});
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-east4");
export const storage = getStorage(app);
export default app;
