importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDBv79_QmNWN6TUA0U43NI1h0_Gj_pY4L0",
  authDomain: "irrigation-c7c2e.firebaseapp.com",
  projectId: "irrigation-c7c2e",
  storageBucket: "irrigation-c7c2e.firebasestorage.app",
  messagingSenderId: "591370719434",
  appId: "1:591370719434:web:238453c22c4a76051be433",
  measurementId: "G-TQB23RC3RB",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png", // optional
  });
});
