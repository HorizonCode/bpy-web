import { apiUrl } from "$lib/env.js";
import type { User } from "$lib/types.js";

export async function load({ params }) {
  //TODO: load userdata from bpy api
  const requestedUserId = params.userId;

  const requestedUserData = await fetch(
    `${apiUrl}/get_player_info?id=${requestedUserId}&scope=all`,
  );
  if (!requestedUserData.ok) return {};
  const requestedUserDataJson = await requestedUserData.json() as User;
  return {
    user: requestedUserDataJson.player,
  };
}
