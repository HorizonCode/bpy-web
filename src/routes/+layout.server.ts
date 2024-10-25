import { getUserFromSession } from '$lib/user';
import { getRedisClient } from '../hooks.server';
import dayjs from 'dayjs';

export async function load({ url, cookies }) {
	const sessionToken = cookies.get('sessionToken') ?? undefined;
	if (sessionToken) {
		const user = await getUserFromSession(sessionToken);
		if (user) {
			const redisClient = await getRedisClient();
			const sessionExpiry = dayjs().add(30, 'day');
			// NOTE: refresh cookie and session token
			await redisClient.set(`user:session:${sessionToken}`, user.id, {
				EXAT: sessionExpiry.toDate().getTime()
			});
			cookies.set('sessionToken', sessionToken, {
				path: '/',
				priority: 'high',
				maxAge: sessionExpiry.toDate().getTime()
			});
			return {
				url: url.pathname,
				currentUser: {
					id: user.id,
					username: user.name
				}
			};
		}
	}

	return {
		url: url.pathname
	};
}
