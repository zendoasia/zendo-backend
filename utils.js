import { jwtVerify } from "jose";

export function respond(message, code, { ...options } = {}) {
  return new Response(
    JSON.stringify({
      code,
      message,
      ...options,
    }),
    {
      status: code,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function verifyFrontendJWT(env, token) {
  const { payload } = await jwtVerify(token, env.NEXT_PRIVATE_JWT_SHARED_SECRET, {
    algorithms: ["HS256"],
  });
  return payload;
}
