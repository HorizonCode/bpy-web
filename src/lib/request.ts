import { apiUrl } from "./env";
import type { Clan } from "./types";

export const getClan = async (clanId: number) => {
  try {
    const requestedUserData = await fetch(
      `${apiUrl}/get_clan?id=${clanId}`,
    );
    if (!requestedUserData.ok) return undefined;
    return await requestedUserData.json() as Clan;
  } catch {
    return undefined;
  }
};
