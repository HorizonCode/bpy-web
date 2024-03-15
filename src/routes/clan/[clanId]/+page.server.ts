import { getClan } from "$lib/request.js";

export async function load({ params }) {
  const clanId = params.clanId;
  if (!(/^\d.+$/.test(clanId))) return {};
  return {
    clan: await getClan(parseInt(clanId)),
  };
}
