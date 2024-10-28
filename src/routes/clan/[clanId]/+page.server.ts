import { getClan } from '$lib/api';
import { isNumber } from '$lib/stringUtil.js';

export async function load({ params }) {
	const clanId = params.clanId;
	if (!isNumber(clanId)) return {};
	const clan = await getClan(parseInt(clanId));
	return {
		clan
	};
}
