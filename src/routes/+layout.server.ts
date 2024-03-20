import { getUserFromSession } from '$lib/user.js';
import { getRedisClient } from '../hooks.server.js';

export async function load({ url, cookies }) {
  const sessionToken = cookies.get("sessionToken") ?? undefined;
  if (sessionToken) {
    const user = await getUserFromSession(sessionToken);
    if (user) {
      const redisClient = await getRedisClient();
      // NOTE: refresh cookie and session token
      await redisClient.set(`user:session:${sessionToken}`, user.id, {
        EX: 86400,
      });
      cookies.set("sessionToken", sessionToken, {
        path: "/",
        priority: "high",
        maxAge: Number.MAX_SAFE_INTEGER,
      });
      return {
        url: url.pathname,
        currentUser: {
          id: user.id,
          username: user.name,
        }
      }
    }
  }


  return {
    url: url.pathname,
  };
}
