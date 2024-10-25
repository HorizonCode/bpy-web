export const getInfoFromIP = async (
	ip: string
): Promise<{
	as: string;
	asname: string;
	city: string;
	continent: string;
	country: string;
	countryCode: string;
	currency: string;
	district: string;
	hosting: boolean;
	isp: string;
	lat: number;
	lon: number;
	mobile: boolean;
	offset: number;
	org: string;
	proxy: boolean;
	query: string;
	region: string;
	regionName: string;
	status: string;
	timezone: string;
	zip: string;
}> => {
	const radarRequest = await fetch(
		`https://pro.ip-api.com/json/${ip}?fields=66842623&key=ipapiq9SFY1Ic4`,
		{
			// Free Pro API i guess ¯\_(ツ)_/¯
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
				Origin: 'https://members.ip-api.com',
				Host: 'pro.ip-api.com'
			}
		}
	);
	return await radarRequest.json();
};
