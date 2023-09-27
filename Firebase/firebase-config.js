import firebase from 'firebase/compat';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';



const firebaseConfig = {
  apiKey: "AIzaSyAONWQF8I71gJs43G_CL126XyNgQrZgL4M",
  authDomain: "sem1project-98b5e.firebaseapp.com",
  projectId: "sem1project-98b5e",
  storageBucket: "sem1project-98b5e.appspot.com",
  messagingSenderId: "465496393910",
  appId: "1:465496393910:web:81ef48418bf6c34926be17",
  measurementId: "G-T3CEMGHB5R"
};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig)
export const authentication = getAuth(app);
export const db = getFirestore(app);
export { firebase };