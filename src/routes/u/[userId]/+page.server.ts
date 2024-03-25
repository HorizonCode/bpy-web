import { apiUrl } from "$lib/env.js";
import { sanitizeHtml } from "$lib/html.js";
import type { User } from "$lib/types.js";
import { parse } from "marked";

export async function load({ params }) {
  const requestedUserId = params.userId;

  const requestedUserData = await fetch(
    `${apiUrl}/get_player_info?id=${requestedUserId}&scope=all`,
  );
  if (!requestedUserData.ok) return {};
  const requestedUserDataJson = await requestedUserData.json() as User;
  const userpageData = requestedUserDataJson.player?.info.userpage_content ??
    "";
  const sanitizedUserPage = sanitizeHtml(userpageData);
  const parsedUserPage = await parse(sanitizedUserPage, {
    async: true,
    gfm: true,
  });

  return {
    user: requestedUserDataJson.player,
    userpage: parsedUserPage,
  };
}
