export const statusIntToString = (statusInt: number): string => {
  switch (statusInt) {
    case 5:
      return "Loved";
    case 4:
      return "Qualified";
    case 3:
      return "Approved";
    case 2:
      return "Ranked";
    case 0:
      return "WIP";
    case -1:
      return "Graveyard";
    default:
      return "Pending";
  }
};
