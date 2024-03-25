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

export const statusIntToColor = (statusInt: number): string => {
  switch (statusInt) {
    case 1:
      return "#ffc650";
    case 2:
      return "#7374ff";
    case 3:
      return "#eb5151";
    case 4:
      return "#86c66c";
    case 5:
    case 11:
    case 12:
      return "#f29927";
    case 6:
      return "#ff6073";
    case 8:
      return "#d70de0";
    case 13:
      return "#ff6dd5";
    default:
      return "#62fa7f";
  }
};
