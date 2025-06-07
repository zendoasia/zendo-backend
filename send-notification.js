import { sendFCMNotification } from "./fcm";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response(
        {
          error: 405,
          message: "This server does not accept any non-POST requests.",
        },
        { status: 405, headers: { "Content-Type": "application/json" } },
      );
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
          code: 200,
          messageId,
          message: "Notification sent successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          code: 500,
          message: "Failed to send notification",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
};
