import { apiUrl } from "$lib/env.js";
import type { Clan } from "$lib/types.js";

export async function load({ params }) {
  const requestedClanId = params.clanId;

  const requestedUserData = await fetch(
    `${apiUrl}/get_clan?id=${requestedClanId}`,
  );
  if (!requestedUserData.ok) return {};
  const requestedUserDataJson = await requestedUserData.json() as Clan;
  return {
    clan: requestedUserDataJson,
  };
}
