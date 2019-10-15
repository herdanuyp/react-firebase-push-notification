import * as firebase from "firebase/app";
import "@firebase/messaging";
import { toast } from "react-toastify";

const initializeAppFirebase = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
});

const messaging = initializeAppFirebase.messaging();

messaging.usePublicVapidKey(process.env.REACT_APP_FIREBASE_VAPID_KEY);

// check if push notification is supported by this browser
function isPushNotificationSupported() {
  return "serviceWorker" in navigator;
}

function isTokenSentToServer() {
  return window.localStorage.getItem("sentToServer") === "1";
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log("Sending token to server...");
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.log(
      "Token already sent to server so won't send it again " +
        "unless it changes"
    );
  }
}

// ask for user permission to allow notification on their browser
function askUserPermission() {
  return Notification.requestPermission().then(permission => {
    console.log(permission);
    if (permission === "granted") {
      console.log("Notification permission granted.");
      messaging.getToken().then(currentToken => {
        if (currentToken) {
          console.log(currentToken);
          sendTokenToServer(currentToken);
        } else {
          // Show permission request.
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
          // Show permission UI.
          setTokenSentToServer(false);
        }
      });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}

function sendNotification() {
  const img = "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg";
  const text = "Take a look at this brand new t-shirt!";
  const title = "New Product Available";
  const options = {
    body: text,
    icon: "./assets/images/reset-world.jpg",
    vibrate: [200, 100, 200],
    tag: "new-product",
    image: img,
    badge: "../public/apple-touch-icon.png",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://via.placeholder.com/128/ff0000"
      }
    ]
  };
  navigator.serviceWorker.ready.then(function(serviceWorker) {
    serviceWorker.showNotification(title, options);
  });
}

// async function createNotificationSubscription() {
//   //wait for service worker installation to be ready
//   const serviceWorker = await navigator.serviceWorker.ready;
//   // subscribe and return the subscription
//   return await serviceWorker.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
//   });
// }

// function getUserSubscription() {
//   //wait for service worker installation to be ready, and then
//   return navigator.serviceWorker.ready
//     .then(function(serviceWorker) {
//       return serviceWorker.pushManager.getSubscription();
//     })
//     .then(function(pushSubscription) {
//       return pushSubscription;
//     })
//     .catch(error => console.log(error));
// }

messaging.onMessage(payload => {
  toast.info(payload.data.message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: false
  });
});

export {
  askUserPermission,
  isPushNotificationSupported,
  initializeAppFirebase,
  // createNotificationSubscription,
  // getUserSubscription,
  // sendNotification,
  messaging
};
