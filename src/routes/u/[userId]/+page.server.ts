import { getClan, getPlayer } from '$lib/api.js';
import { sanitizeHtml } from '$lib/html';
import { isNumber } from '$lib/stringUtil.js';
import { parse } from 'marked';

export async function load({ params }) {
	const requestedUserId = params.userId;

	if (!isNumber(requestedUserId)) {
		return;
	}

	const user = await getPlayer(parseInt(requestedUserId), 'all');
	const userpageData = user?.player?.info.userpage_content ?? '';
	const sanitizedUserPage = sanitizeHtml(userpageData);
	const parsedUserPage = await parse(sanitizedUserPage, {
		async: true,
		gfm: true
	});

	const clan = user?.player?.info.clan_id ? await getClan(user.player.info.clan_id) : undefined;

	return {
		user: user?.player,
		clan: clan,
		userpage: parsedUserPage
	};
}
