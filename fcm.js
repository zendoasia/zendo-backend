import admin from "firebase-admin";

// Initialize Firebase Admin only once
let initialized = false;
function initFirebaseAdmin() {
  if (!initialized && !admin.apps.length) {
    const serviceAccount = {
      type: "service_account",
      project_id: context.env.FIREBASE_PROJECT_ID,
      private_key_id: context.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: context.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: context.env.FIREBASE_CLIENT_EMAIL,
      client_id: context.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${context.env.FIREBASE_CLIENT_EMAIL}`,
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initialized = true;
  }
}

export async function sendFCMNotification({ token, title, body, data }) {
  initFirebaseAdmin();
  if (!token) throw new Error("FCM token is required");
  const message = {
    token,
    notification: {
      title: title || "Thank you for installing Zendo! 🎉",
      body: body || "Welcome to the Zendo experience! Consider supporting the project.",
    },
    data: {
      url: data?.url || "/kofi",
      action: data?.action || "support",
      tag: "install-thank-you",
      actions: JSON.stringify([
        {
          action: "support",
          title: "Support on Ko-fi ☕",
          icon: "/assets/icons/maskable-icon.png",
        },
        { action: "explore", title: "Explore App", icon: "/assets/icons/maskable-icon.png" },
      ]),
    },
    webpush: {
      notification: {
        icon: "/assets/icons/maskable-icon.png",
        badge: "/assets/icons/maskable-icon.png",
        tag: "install-thank-you",
        requireInteraction: true,
        actions: [
          {
            action: "support",
            title: "Support on Ko-fi ☕",
            icon: "/assets/icons/maskable-icon.png",
          },
          { action: "explore", title: "Explore App", icon: "/assets/icons/maskable-icon.png" },
        ],
      },
    },
  };
  return admin.messaging().send(message);
}
