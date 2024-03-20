import { login } from '$lib/user.js';
import { error, json } from '@sveltejs/kit'
import { getRedisClient } from '../../hooks.server.js';
import { makeid } from '$lib/stringUtil.js';

export const POST = async ({ cookies, request }) => {
  if (request.headers.get("content-type") !== "application/json") return error(400, "Invalid content type");
  const bodyData: { username: string; password: string; } = JSON.parse(Buffer.from(await request.arrayBuffer()).toString("utf-8"));
  const user = await login({ username: bodyData.username, password: bodyData.password });
  if (!user) return error(400, "Invalid login credentials");

  const redisClient = await getRedisClient();
  const sessionToken = makeid(128);

  const result = await redisClient.set(`user:session:${sessionToken}`, user.id, {
    EX: 86400,
  });

  if (result !== "OK") return error(500, "Failed to create session");

  cookies.set("sessionToken", sessionToken, {
    path: "/",
    priority: "high",
    maxAge: Number.MAX_SAFE_INTEGER,
  });

  return json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.name,
    }
  });
}