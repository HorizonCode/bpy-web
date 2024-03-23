import { getPlayerCounts } from '$lib/api';

export const load = async () => {
	const userCounts = await getPlayerCounts();
	return {
		userCounts
	};
};
