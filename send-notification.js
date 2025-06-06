import { sendFCMNotification } from "./fcm";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      const body = await request.json();
      const { token, title, body: notificationBody, data } = body;
      const messageId = await sendFCMNotification({
        token,
        title,
        body: notificationBody,
        data,
        env,
      });
      return new Response(
        JSON.stringify({
          success: true,
          messageId,
          message: "Notification sent successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to send notification",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
