export function makeid(length?: number): string {
	if (!length) length = 10;
	const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength: number = characters.length;

	return Array.from({ length }, () =>
		characters.charAt(Math.floor(Math.random() * charactersLength))
	).join('');
}

export const numberHumanReadable = (number: number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const abbreviateNumber = (number: number, decimals?: number) => {
	const abbreviations = ['', 'K', 'M', 'B', 'T'];
	const tier = (Math.log10(Math.abs(number)) / 3) | 0;

	if (tier === 0) return String(number);

	const suffix = abbreviations[tier];
	const scale = Math.pow(10, tier * 3);
	const scaledNumber = number / scale;

	return scaledNumber.toFixed(decimals ?? 2) + suffix;
};

export function isNumber(str: string) {
	return !isNaN(parseInt(str));
}
