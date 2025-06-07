import sendNotificationHandler from "./send-notification";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico") {
      const iconUrl = import.meta.resolve("./favicon.ico");
      const res = await fetch(iconUrl);

      return new Response(res.body, {
        headers: {
          "Content-Type": "image/x-icon",
          "Cache-Control": "public, max-age=31536000"
        }
      });
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
