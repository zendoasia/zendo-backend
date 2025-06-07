import { serveStatic } from "wrangler";
import sendNotificationHandler from "./send-notification";

export default {
  async fetch(request, env, ctx) {
    const staticResponse = await serveStatic(request, {
      root: "./public",
    });

    // If static file was found, return it
    if (staticResponse.status !== 404) {
      return staticResponse;
    }

    const url = new URL(request.url);

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: 405,
          message: "This server does not accept any non-POST requests.",
        }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (url.pathname === "/send-notification") {
      return sendNotificationHandler.fetch(request, env, ctx);
    }

    return new Response(
      JSON.stringify({
        code: 404,
        message: "The route you are searching for was not found.",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
