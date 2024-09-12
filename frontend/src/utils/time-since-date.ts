import { useTranslations } from "next-intl";

export const TimeSinceDate = (date: string | number): string => {
  const tTime = useTranslations("Time");
  const postDate = new Date(date);
  const timeSincePostDate = new Date().getTime() - postDate.getTime();

  const minutes = Math.floor(timeSincePostDate / (1000 * 60));
  const hours = Math.floor(timeSincePostDate / (1000 * 60 * 60));
  const days = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24 * 7));

  let timePassed;
  if (weeks > 0) {
    timePassed = `${weeks} ${weeks > 1 ? tTime("weeks") : tTime("week")}`;
  } else if (days > 0) {
    timePassed = `${days} ${days > 1 ? tTime("days") : tTime("day")}`;
  } else if (hours > 0) {
    timePassed = `${hours} ${hours > 1 ? tTime("hours") : tTime("hour")}`;
  } else {
    timePassed =
      minutes > 0
        ? `${minutes} ${minutes > 1 ? tTime("minutes") : tTime("minute")}`
        : tTime("now");
  }

  return timePassed;
};
