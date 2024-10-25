export const removeClanTag = (str: string) => str.replace(/^\[[^\]]*?\]\s/g, '');

export const removeTrailingZeroes = (number: number) =>
	number >= 100 ? number.toFixed(2).replace(/\.?00$/gm, '') : number.toFixed(2);

export const usernameRegex = /^(?=.{3,16}$)[a-zA-Z0-9]+(?:[- ][a-zA-Z0-9]+)*$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d!@#$%^&*()_+\-={}[\]:"|,.<>/?]{8,128}$/;
