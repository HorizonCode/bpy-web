import { type DBUser } from '$lib/types.js';
import { getMySQLDatabase, getRedisClient } from '../hooks.server.js';

export async function load({ url, cookies }) {
  const sessionToken = cookies.get("sessionToken") ?? undefined;
  if (sessionToken) {
    const redisClient = await getRedisClient();
    const mySQLDatabase = await getMySQLDatabase();
    const userId = await redisClient.get(`user:session:${sessionToken}`);
    const user = await mySQLDatabase<DBUser>("users").where("id", userId).first();
    if (user) return {
      url: url.pathname,
      currentUser: {
        id: user.id,
        username: user.name,
      }
    }
  }


  return {
    url: url.pathname,
  };
}
