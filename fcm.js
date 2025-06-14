import admin from "firebase-admin";
import { respond } from "./utils";

let firebaseInitPromise = null;

function initFirebaseAdmin(env) {
  if (admin.apps.length) return Promise.resolve();

  if (!firebaseInitPromise) {
    firebaseInitPromise = (async () => {
      if (!admin.apps.length) {
        const serviceAccount = {
          type: "service_account",
          project_id: env.NEXT_PRIVATE_FIREBASE_PROJECT_ID,
          private_key_id: env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY_ID,
          private_key: env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          client_email: env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
          client_id: env.NEXT_PRIVATE_FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL}`,
        };
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
    })();
  }
  return firebaseInitPromise;
}

export async function sendFCMNotification({ token, title, body, data, env }) {
  await initFirebaseAdmin(env);
  if (!token)
    return respond("Please include the firebase cloud messaging token in your headers.", 403);

  const actions = [
    {
      action: "support",
      title: "Support on Ko-fi ☕",
    },
    {
      action: "explore",
      title: "Explore App",
    },
  ];

  const message = {
    token,
    notification: {
      title: title || "Zendo",
      body: body || "You had a new notification minutes ago! Check it out!",
    },
    data: {
      url: data?.url || "/kofi",
      action: data?.action || "support",
      tag: "install-thank-you",
      // Stringify actions for the service worker
      actions: JSON.stringify(actions),
      // Add timestamp for notification grouping
      timestamp: Date.now().toString(),
    },
    // WebPush-specific configuration (critical for action buttons)
    webpush: {
      headers: {
        Urgency: "high",
        TTL: "86400",
      },
      notification: {
        icon: "/assets/icons/maskable-icon.png",
        badge: "/assets/icons/maskable-icon.png",
        tag: "install-thank-you",
        requireInteraction: true,
        actions: actions,
        // Vibration pattern
        vibrate: [200, 100, 200],
        // Data that will be available to the service worker
        data: {
          url: data?.url || "/kofi",
          dateOfArrival: Date.now(),
        },
        // Chrome-specific options
        silent: false,
        renotify: true,
        // Direction for languages
        dir: "auto",
      },
      // FCM payload for browsers that support data messages
      fcmOptions: {
        link: data?.url || "/kofi",
      },
    },
    android: {
      priority: "high",
      notification: {
        icon: "notification_icon",
        color: "#4285F4",
        clickAction: data?.url || "/kofi",
      },
    },
  };
  return admin.messaging().send(message);
}
