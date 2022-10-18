import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const formatMinute = (minutes: number) => {
  let m = minutes % 60;
  if (!m) {
    return "";
  }
  return m + (m === 1 ? " minute." : " minutes.");
};

const formatHour = (minutes: number) => {
  const h = Math.floor((minutes % (60 * 24)) / 60);
  if (!h) {
    return formatMinute(minutes);
  }
  return h + (h === 1 ? " hour, " : " hours, ") + formatMinute(minutes);
};

export const formatTime = (minutes: number) => {
  minutes = Math.round(minutes);
  if (minutes <= 0) {
    return "0 minutes.";
  }
  const d = Math.floor(minutes / 60 / 24);
  let formatted;
  if (!d) {
    formatted = formatHour(minutes);
  } else {
    formatted = d + (d === 1 ? " day, " : " days, ") + formatHour(minutes);
  }
  if (formatted === "") {
    return "0 minutes.";
  }
  return formatted;
};

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
