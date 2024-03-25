export const statusIntToString = (statusInt: number): string => {
  switch (statusInt) {
    case 1:
      return "AFK";
    case 2:
      return "Playing";
    case 3:
      return "Editing";
    case 4:
      return "Modding";
    case 5:
    case 11:
    case 12:
      return "Multiplayer";
    case 6:
      return "Watching";
    case 8:
      return "Testing";
    case 13:
      return "Browsing direct";
    default:
      return "Idle";
  }
};
