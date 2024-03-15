export const removeClanTag = (str: string) =>
  str.replace(/^\[[^\]]*?\]\s/g, "");
