import { apiUrl } from "./env";
import type {
  Clan,
  MapInfo,
  MapScores,
  PlayerCounts,
  PlayerMostPlayed,
  PlayerScores,
  PlayerStatus,
} from "./types";

export const getClan = async (clanId: number): Promise<Clan | undefined> => {
  try {
    const requestedClanData = await fetch(`${apiUrl}/get_clan?id=${clanId}`);
    if (!requestedClanData.ok) return undefined;
    return (await requestedClanData.json()) as Clan;
  } catch {
    return undefined;
  }
};

export const getBeatmap = async (
  beatmapId: number,
): Promise<MapInfo | undefined> => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_map_info?id=${beatmapId}`,
    );
    if (!requestedMapData.ok) return undefined;
    return (await requestedMapData.json()) as MapInfo;
  } catch {
    return undefined;
  }
};

export const getBeatmapScores = async (
  opts: { beatmapMd5: string; mode: number; scope: "best" | "recent" },
): Promise<MapScores | undefined> => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_map_scores?md5=${opts.beatmapMd5}&mode=${opts.mode}&limit=50&scope=${opts.scope}`,
    );
    if (!requestedMapData.ok) return undefined;
    return (await requestedMapData.json()) as MapScores;
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
}): Promise<PlayerScores | undefined> => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_player_scores?id=${opts.userId}&mode=${opts.mode}&limit=${opts.limit}&offset=${opts.offset}&include_failed=${opts.includeFailed ?? true
      }&include_loved=${opts.includeLoved ?? false}&scope=${opts.scope}`,
    );
    if (!requestedMapData.ok) return undefined;
    return (await requestedMapData.json()) as PlayerScores;
  } catch {
    return undefined;
  }
};

export const getPlayerMostPlayed = async (opts: {
  userId: number;
  mode: number;
  limit: number;
}): Promise<PlayerMostPlayed | undefined> => {
  try {
    const requestedMapData = await fetch(
      `${apiUrl}/get_player_most_played?id=${opts.userId}&mode=${opts.mode}&limit=${opts.limit}`,
    );
    if (!requestedMapData.ok) return undefined;
    return (await requestedMapData.json()) as PlayerMostPlayed;
  } catch {
    return undefined;
  }
};

export const getPlayerCounts = async (): Promise<PlayerCounts | undefined> => {
  try {
    const requestedPlayerData = await fetch(`${apiUrl}/get_player_count`);
    if (!requestedPlayerData.ok) return undefined;
    return (await requestedPlayerData.json()) as PlayerCounts;
  } catch {
    return undefined;
  }
};

export const getPlayerStatus = async (
  uid: number,
): Promise<PlayerStatus | undefined> => {
  try {
    const requestedPlayerData = await fetch(
      `${apiUrl}/get_player_status?id=${uid}`,
    );
    if (!requestedPlayerData.ok) return undefined;
    return (await requestedPlayerData.json()) as PlayerStatus;
  } catch {
    return undefined;
  }
};
