export const statusIntToString = (statusInt: number): string => {
	switch (statusInt) {
		case 4:
			return 'Loved';
		case 3:
			return 'Qualified';
		case 2:
			return 'Approved';
		case 1:
			return 'Ranked';
		case -1:
			return 'WIP';
		case -2:
			return 'Graveyard';
		default:
			return 'Pending';
	}
};
