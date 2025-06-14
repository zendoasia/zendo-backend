# Zendo Backend

The Zendo Backend is a serverless backend for the Zendo website, hosted on Cloudflare Workers. It provides secure endpoints for sending push notifications to clients using Firebase Cloud Messaging (FCM).

## Features

- **Serverless**: Runs on Cloudflare Workers for scalability and low latency.
- **Push Notifications**: Sends notifications to clients via FCM.
- **JWT Authentication**: Secures endpoints using JSON Web Tokens.
- **Static Asset Serving**: Serves static files like `robots.txt` and `favicon.ico` from the `public` directory.

## Endpoints

### `POST /send-notification`

Sends a push notification to a client device using FCM.

**Request Body (JSON):**

- `token` (string): FCM device token (required)
- `title` (string): Notification title (optional)
- `body` (string): Notification body (optional)
- `data` (object): Additional data (optional)

**Headers:**

- `Authorization: Bearer <JWT>` (required)

**Response:**

- `200 OK` with message ID on success
- `400/403/500` with error message on failure

## Project Structure

- `index.js` — Main entry point and routing logic
- `send-notification.js` — Handles notification requests
- `fcm.js` — FCM integration and message formatting
- `utils.js` — Utility functions (response formatting, JWT verification)
- `public/` — Static assets (e.g., `robots.txt`, `favicon.ico`)
- `wrangler.toml` — Cloudflare Workers configuration

## Setup & Deployment

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   Set Firebase and JWT secrets in your Cloudflare Worker environment.
3. **Lint code:**
   ```sh
   npm run lint
   ```
4. **Deploy:**
   Use [Wrangler](https://developers.cloudflare.com/workers/wrangler/) to deploy:
   ```sh
   npx wrangler deploy
   ```

## Environment Variables

Set the following secrets in your Cloudflare Worker environment:

- `NEXT_PRIVATE_FIREBASE_PROJECT_ID`
- `NEXT_PRIVATE_FIREBASE_PRIVATE_KEY_ID`
- `NEXT_PRIVATE_FIREBASE_PRIVATE_KEY`
- `NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL`
- `NEXT_PRIVATE_FIREBASE_CLIENT_ID`
- `NEXT_PRIVATE_JWT_SHARED_SECRET`

## License

MIT - See LICENSE for more details
