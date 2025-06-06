# Cloudflare Worker FCM Notification Service

This folder contains the backend logic for sending Firebase Cloud Messaging (FCM) notifications, extracted from the main Next.js project. You can move this folder to a new repository and deploy it as a Cloudflare Worker with secrets.

## Files
- `fcm.js`: Contains the logic to initialize Firebase Admin SDK and send FCM notifications.
- `send-notification.js`: Cloudflare Worker entrypoint that exposes a POST endpoint to send notifications.

## Usage
1. **Set up environment variables (secrets) in Cloudflare Worker dashboard or wrangler.toml:**
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_CLIENT_ID`

2. **Deploy the worker using Wrangler:**
   - Update `wrangler.toml` with the correct entrypoint and bindings.
   - Deploy: `npx wrangler deploy`

3. **Call the Worker endpoint from your Next.js app:**
   - Make a POST request to the Worker URL with `{ token, title, body, data }` in the JSON body.

## Example Request
```json
POST /send-notification
Content-Type: application/json
{
  "token": "<fcm_token>",
  "title": "Hello!",
  "body": "This is a test notification.",
  "data": { "url": "/kofi", "action": "support" }
}
```

## Security
- **Never expose your Firebase Admin credentials to the client or in edge code.**
- This worker should be deployed in a secure environment with secrets managed by Cloudflare.

---
Move this folder to a new repo and deploy as a Cloudflare Worker. Then update your Next.js app to call the new endpoint for sending notifications.
