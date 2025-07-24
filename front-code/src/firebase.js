// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDBv79_QmNWN6TUA0U43NI1h0_Gj_pY4L0",
  authDomain: "irrigation-c7c2e.firebaseapp.com",
  projectId: "irrigation-c7c2e",
  storageBucket: "irrigation-c7c2e.firebasestorage.app",
  messagingSenderId: "591370719434",
  appId: "1:591370719434:web:238453c22c4a76051be433",
  measurementId: "G-TQB23RC3RB",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
