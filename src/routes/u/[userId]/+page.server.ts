import { apiUrl } from "$lib/env.js";
import type { UserInfo } from "$lib/types.js";

export async function load({ params }) {
  //TODO: load userdata from bpy api
  const requestedUserId = params.userId;

  const requestedUserData = await fetch(
    `${apiUrl}/get_player_info?id=${requestedUserId}&scope=info`,
  );
  if (!requestedUserData.ok) return {};
  const requestedUserDataJson = await requestedUserData.json() as UserInfo;
  return {
    user: requestedUserDataJson.player?.info,
  };
}
