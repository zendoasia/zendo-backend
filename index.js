import sendNotificationHandler from "./send-notification";
import { respond, verifyFrontendJWT } from "./utils";

const robotsTxt = `User-agent: *
Disallow: /`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/robots.txt" || pathname === "/favicon.ico") {
      return await env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return respond("This server does not accept any non-POST requests.", 405);
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return respond("Either no authentication token was found, or headers were malformed.", 403);
    }

    const token = authHeader.slice("Bearer ".length).trim();

    try {
      await verifyFrontendJWT(env, token);
    } catch (err) {
      console.log(`Invalid request from another origin or JWT verification error: ${err}`);
      return respond("Either your token is invalid or there was a issue validating it.", 403);
    }

    // Continue

    if (pathname === "/send-notification") {
      return sendNotificationHandler.fetch(request, env, ctx);
    }

    return respond("The route you are searching for was not found.", 404);
  },
};
