import { apiUrl } from "./env";
import type { Clan, MapInfo, MapScores } from "./types";

export const getClan = async (clanId: number) => {
  try {
    const requestedClanData = await fetch(
      `${apiUrl}/get_clan?id=${clanId}`,
    );
    if (!requestedClanData.ok) return undefined;
    return await requestedClanData.json() as Clan;
  } catch {
    return undefined;
  }
};

export const getBeatmap = async (beatmapId: number) => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_map_info?id=${beatmapId}`,
    );
    if (!requestedMapData.ok) return undefined;
    return await requestedMapData.json() as MapInfo;
  } catch {
    return undefined;
  }
};

export const getBeatmapScores = async (
  beatmapMd5: string,
  mode: number,
  scope: "best" | "recent",
) => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_map_scores?md5=${beatmapMd5}&mode=${mode}&scope=${scope}`,
    );
    if (!requestedMapData.ok) return undefined;
    return await requestedMapData.json() as MapScores;
  } catch {
    return undefined;
  }
};
