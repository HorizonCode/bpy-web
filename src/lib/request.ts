const ipHeaders = ['cf-connecting-ip', 'x-forwarded-for', 'x-real-ip'];

export const getClientIP = (request: Request, fallback: string): string => {
	for (const header of ipHeaders)
		if (request.headers.has(header) && request.headers.get(header) != null)
			return request.headers.get(header) as string;

	return fallback;
};
