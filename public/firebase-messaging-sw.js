/*global firebase*/
/*eslint no-undef: "error"*/

importScripts("https://www.gstatic.com/firebasejs/7.1.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.1.0/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSANGER_ID
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = "DEMO PUSH NOTIFICATION";
  const notificationOptions = { body: payload.data.message };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
