import sendNotificationHandler from "./send-notification";
import { getAsset } from "@cloudflare/kv-asset-handler";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      return await getAsset(request);
    } catch (err) {
      console.log(
        JSON.stringify({
          level: "info",
          event: "asset_not_found",
          url: request.url,
        })
      );
    }

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
      return sendNotificationHandler.fetch(request, env);
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
