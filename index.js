import sendNotificationHandler from "./send-notification";

const robotsTxt = `User-agent: *
Disallow:`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/robots.txt") {
      return new Response(robotsTxt, {
        headers: {
          "Content-Type": "text/plain",
        },
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
