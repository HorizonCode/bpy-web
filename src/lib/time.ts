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
  if (months > 0) return months + "m";
  if (weeks > 0) return weeks + "w";
  if (days > 0) return days + "d";
  if (hours > 0) return hours + "h";
  if (minutes > 0) return minutes + "min";
  return "now";
};

export const getTimeAgo = (date: Date) => {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

  if (daysDiff === 0) {
    return "today";
  } else if (daysDiff < 7) {
    return daysDiff + (daysDiff === 1 ? " day ago" : " days ago");
  }
  if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return weeks + (weeks === 1 ? " week ago" : " weeks ago");
  }
  if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);
    return months + (months === 1 ? " month ago" : " months ago");
  }

  const years = Math.floor(daysDiff / 365);
  return years + (years === 1 ? " year ago" : " years ago");
};

export const secondsToDHM = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);

  return `${days}d ${hours}h ${minutes}m`;
};

export const secondsToHours = (seconds: number) => {
  const hours = Math.trunc(seconds / 3600);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};
