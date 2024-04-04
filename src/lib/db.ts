import { getMySQLDatabase } from "../hooks.server";
import type { DBClan } from "./types";

export const getClans = async (
  opts: { mode: number; limit: number; offset: number },
): Promise<DBClan[] | undefined> => {
  try {
    //NOTE: PLEASE FIX THIS LATER THIS IS BS
    const mysqlDB = await getMySQLDatabase();
    if (!mysqlDB) return [];
    if (opts.limit < 1 || opts.offset < 0) return [];
    if (opts.limit > 100) opts.limit = 100;

    const clans = await mysqlDB("clans").select(
      "clans.id",
      "clans.name",
      "clans.tag",
      "clans.owner"
    ).select(mysqlDB.raw('ROUND(SUM(stats.pp) / COUNT(users.id)) as total_pp')).count("users.id as users").join("users", "clans.id", "users.clan_id").join(
      "stats",
      "users.id",
      "stats.id",
    ).where("stats.mode", opts.mode).groupBy("clans.id", "clans.name").orderBy("total_pp", "desc").limit(opts.limit).offset(opts.offset);
    return clans.map((c) => {
      c.total_pp = parseFloat(c.total_pp as string);
      return c;
    }) as DBClan[];
  } catch (e) {
    console.log(e);
    return undefined;
  }
};