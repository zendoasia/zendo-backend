import sendNotificationHandler from "./send-notification";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    await env.ANALYTICS_ENGINE.writeDataPoint({
      blobs: ["user_visited"],
      doubles: [1.0],
      indexes: [Date.now()],
    });
    if (!request.method === "POST") {
      return new Response(
        {
          error: 405,
          message: "This server does not accept any non-POST requests.",
        },
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }
    if (url.pathname === "/send-notification") {
      return sendNotificationHandler.fetch(request, env);
    }

    return new Response(
      { code: 404, message: "The route you are searching for was not found." },
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
