import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import sendNotificationHandler from './send-notification';

export default {
  async fetch(request, env, ctx) {
    try {
      const asset = await getAssetFromKV(
        { request },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, waitUntil: ctx.waitUntil }
      );
      return asset;
    } catch (err) {
      console.log(`Asset not found: ${request.url}`);
    }

    const url = new URL(request.url);

    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          error: 405,
          message: 'This server does not accept any non-POST requests.',
        }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (url.pathname === '/send-notification') {
      return sendNotificationHandler.fetch(request, env, ctx);
    }

    return new Response(
      JSON.stringify({
        code: 404,
        message: 'The route you are searching for was not found.',
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
