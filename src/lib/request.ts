import { apiUrl } from "./env";
import type { Clan, MapInfo, MapScores, PlayerScores } from "./types";

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
      `${apiUrl}/get_map_scores?md5=${beatmapMd5}&mode=${mode}&limit=50&scope=${scope}`,
    );
    if (!requestedMapData.ok) return undefined;
    return await requestedMapData.json() as MapScores;
  } catch {
    return undefined;
  }
};

export const getPlayerScores = async (opts: {
  userId: number;
  mode: number;
  limit: number;
  offset: number;
  includeLoved?: boolean;
  includeFailed?: boolean;
  scope: "best" | "recent";
}) => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_player_scores?id=${opts.userId}&mode=${opts.mode}&limit=${opts.limit}&offset=${opts.offset}&include_failed=${
        opts.includeFailed ?? false
      }&include_loved=${opts.includeLoved ?? false}&scope=${opts.scope}`,
    );
    if (!requestedMapData.ok) return undefined;
    return await requestedMapData.json() as PlayerScores;
  } catch {
    return undefined;
  }
};
