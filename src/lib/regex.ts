export const removeClanTag = (str: string) =>
  str.replace(/^\[[^\]]*?\]\s/g, "");

export const removeTrailingZeroes = (number: number) =>
  number.toFixed(2).replace(/\.?00$/gm, "");
