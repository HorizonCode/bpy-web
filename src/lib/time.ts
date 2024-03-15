export const getFormattedTimeFromSeconds = (sec: number) => {
  const date = new Date(0);
  date.setSeconds(sec);
  return date.toISOString().substring(14, 19);
};

export const getTimeSince = (date: Date) => {
  const now = new Date();
  const diff = new Date(now.getTime() - date.getTime()).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return years + "y";
  if (months > 0) return months + "M";
  if (weeks > 0) return weeks + "w";
  if (days > 0) return days + "d";
  if (hours > 0) return hours + "h";
  if (minutes > 0) return minutes + "m";
  return "now";
};
