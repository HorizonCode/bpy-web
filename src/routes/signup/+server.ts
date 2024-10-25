import { login } from '$lib/user';
import { error, json } from '@sveltejs/kit';
import { getRedisClient } from '../../hooks.server';
import { makeid } from '$lib/stringUtil';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';
import { validateTurnstileToken } from '$lib/captcha';
import { getClientIP } from '$lib/request';

const turnstileEnabled =
	pubEnv.PUBLIC_TURNSTILE_SITE_KEY && pubEnv.PUBLIC_TURNSTILE_SITE_KEY.length > 0;
const turnstileSecretKey = env.TURNSTILE_SECRET_KEY;

export const POST = async ({ cookies, request, getClientAddress }) => {
	if (request.headers.get('content-type') !== 'application/json') {
		return error(400, 'Invalid content type');
	}

	if (!env.ALLOW_REGISTRATIONS)
		return json(
			{
				message: 'Registrations are currently disabled.'
			},
			{
				status: 400
			}
		);

	const clientIP = getClientIP(request, getClientAddress());
	const bodyData: { username: string; password: string; captchaToken: string } = JSON.parse(
		Buffer.from(await request.arrayBuffer()).toString('utf-8')
	);

	if (turnstileEnabled) {
		const captchaCheck = await validateTurnstileToken({
			secret: turnstileSecretKey!,
			token: bodyData.captchaToken,
			ip: clientIP
		});

		if (!captchaCheck.success)
			return json(
				{
					message: 'Captcha validation failed.'
				},
				{
					status: 400
				}
			);
	}

	const user = await login({
		username: bodyData.username,
		password: bodyData.password
	});
	if (!user)
		return json(
			{
				message: 'Invalid login credentials'
			},
			{
				status: 400
			}
		);

	const redisClient = await getRedisClient();
	const sessionToken = makeid(128);

	const result = await redisClient.set(`user:session:${sessionToken}`, user.id, {
		EX: 86400
	});

	if (result !== 'OK')
		return json(
			{
				message: 'Failed to create session'
			},
			{
				status: 500
			}
		);

	cookies.set('sessionToken', sessionToken, {
		path: '/',
		priority: 'high',
		maxAge: Number.MAX_SAFE_INTEGER
	});

	return json({
		message: 'Login successful',
		user: {
			id: user.id,
			username: user.name
		}
	});
};
