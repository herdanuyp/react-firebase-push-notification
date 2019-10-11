import { useState, useEffect } from "react";
import {
  askUserPermission,
  isPushNotificationSupported
} from "./push-notification";
import * as serviceWorker from "./serviceWorker";

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotification() {
  const [error, setError] = useState(null);
  //to manage errors
  const [loading, setLoading] = useState(true);
  //to manage async actions

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      serviceWorker.register();
      setLoading(false);
    }
  }, []);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render
}
