import { json } from "@sveltejs/kit";
import { getClans } from "$lib/db";

export async function POST({ url }) {
  const searchParams = url.searchParams;

  //NOTE: Rework this BS

  const limit = parseInt(searchParams.get("limit") ?? "50");
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const mode = parseInt(searchParams.get("mode") ?? "0");

  if (isNaN(limit)) return json({ code: 403, message: "Invalid limit" });
  if (isNaN(offset)) return json({ code: 403, message: "Invalid offset" });
  if (isNaN(mode)) return json({ code: 403, message: "Invalid mode" });

  return json(await getClans({
    limit: limit,
    mode: mode,
    offset: offset
  }));
}