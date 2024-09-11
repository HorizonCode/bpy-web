export const hashCode = (num: number) => {
	let hash = 0;
	if (num === 0) return hash;
	for (let i = 0; i < num.toString().length; i++) {
		const char = num.toString().charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
