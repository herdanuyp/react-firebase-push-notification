import * as firebase from "firebase/app";
import "@firebase/messaging";
import { toast } from "react-toastify";

const initializeAppFirebase = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

const messaging = initializeAppFirebase.messaging();

messaging.usePublicVapidKey(process.env.REACT_APP_FIREBASE_VAPID_KEY);

// check if push notification is supported by this browser
function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "pushManager" in window;
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
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      messaging
        .getToken()
        .then(currentToken => {
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
        })
        .catch(err => {
          console.log("An error occurred while retrieving token. ", err);
          setTokenSentToServer(false);
        });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}

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
  initializeAppFirebase
};
