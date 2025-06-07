import { sendFCMNotification } from "./fcm";
import { respond } from "./utils";

export default {
  async fetch(request, env) {
    try {
      let body;
      try {
        body = await request.json();

        if (!body || Object.keys(body).length === 0) {
          return respond("Request body is empty or invalid", 400);
        }
      } catch (err) {
        console.log(`Error while decoding JSON body of notification: ${err}`)
        return respond("Malformed JSON body", 400);
      }

      const { token, title, body: notificationBody, data } = body;
      const messageId = await sendFCMNotification({
        token,
        title,
        body: notificationBody,
        data,
        env,
      });
      return respond("Successfully sent message to the client.", 200, {
        messageId: messageId,
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : "Unknown error";
      return respond("Failed to send the message to the client.", 500, {
        error: err,
      });
    }
  },
};
