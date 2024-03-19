export const removeClanTag = (str: string) =>
  str.replace(/^\[[^\]]*?\]\s/g, "");

export const removeTrailingZeroes = (number: number) =>
  number >= 100 ? number.toFixed(2).replace(/\.?00$/gm, "") : number.toFixed(2);
