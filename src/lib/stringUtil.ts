export function makeid(length?: number): string {
  if (!length) length = 10;
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength: number = characters.length;

  return Array.from(
    { length },
    () => characters.charAt(Math.floor(Math.random() * charactersLength)),
  ).join("");
}

export const numberHumanReadable = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
