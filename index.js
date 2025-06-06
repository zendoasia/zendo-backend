import sendNotificationHandler from "./send-notification";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/send-notification" && request.method === "POST") {
      return sendNotificationHandler.fetch(request, env, ctx);
    }
    // 404 for all other routes
    return new Response(JSON.stringify({ code: 404, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
