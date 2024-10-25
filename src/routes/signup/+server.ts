import { register } from '$lib/user';
import { error, json } from '@sveltejs/kit';
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

	if (cookies.get('sessionToken')) {
		return json(
			{
				message: 'Already logged in'
			},
			{
				status: 400
			}
		);
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
	const bodyData: { username: string; password: string; email: string; captchaToken: string } =
		JSON.parse(Buffer.from(await request.arrayBuffer()).toString('utf-8'));

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

	const registerAction = await register({
		username: bodyData.username,
		password: bodyData.password,
		email: bodyData.email,
		ip: clientIP
	});

	if (!registerAction.succeeded) {
		return json(
			{
				message: registerAction.message
			},
			{
				status: 400
			}
		);
	}

	return json({
		message: 'Register successful'
	});
};
