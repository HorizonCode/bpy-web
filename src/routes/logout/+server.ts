import { error, json } from '@sveltejs/kit';
import { getRedisClient } from '../../hooks.server';

export const POST = async ({ cookies }) => {
	if (cookies.get('sessionToken') !== undefined) {
		const redisClient = await getRedisClient();

		// Remove sessionToken from redis and delete sessionToken cookie
		await redisClient.del(`user:session:${cookies.get('sessionToken')}`);
		cookies.delete('sessionToken', {
			path: '/'
		});
		return json({
			message: 'Logged out!'
		});
	}
	return error(400, 'Not logged in');
};
