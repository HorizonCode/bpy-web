import { getClan } from "$lib/api";

export async function load({ params }) {
  const clanId = params.clanId;
  if (!(/^\d.+$/.test(clanId))) return {};
  return {
    clan: await getClan(parseInt(clanId)),
  };
}
