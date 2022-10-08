import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const formatSecond = (seconds: number) => {
  const s = Math.round(seconds % 60);
  if (!s) {
    return "";
  }
  return s + (s === 1 ? " second." : " seconds.");
};

const formatMinute = (seconds: number) => {
  const m = Math.floor((seconds % (60 * 60)) / 60);
  if (!m) {
    return formatSecond(seconds);
  }
  return m + (m === 1 ? " minute." : " minutes.") + formatSecond(seconds);
};

const formatHour = (seconds: number) => {
  const h = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  if (!h) {
    return formatMinute(seconds);
  }
  return h + (h === 1 ? " hour, " : " hours, ") + formatMinute(seconds);
};

export const formatTime = (seconds: number) => {
  if (seconds < 0) {
    return "0 seconds.";
  }
  const d = Math.floor(seconds / 60 / 60 / 24);
  let formatted;
  if (!d) {
    formatted = formatHour(seconds);
  } else {
    formatted = d + (d === 1 ? " day, " : " days, ") + formatHour(seconds);
  }
  if (formatted === "") {
    return "0 seconds.";
  }
  return formatted;
};

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
