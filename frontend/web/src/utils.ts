import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const formatMinute = (seconds: number) => {
  const m = Math.round((seconds % (60 * 60)) / 60);
  if (!m) {
    return "";
  }
  return m + (m === 1 ? " minute." : " minutes.");
};

const formatHour = (seconds: number) => {
  const h = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  if (!h) {
    return formatMinute(seconds);
  }
  return h + (h === 1 ? " hour, " : " hours, ") + formatMinute(seconds);
};

export const formatTime = (seconds: number) => {
  const d = Math.floor(seconds / 60 / 60 / 24);
  if (!d) {
    return formatHour(seconds);
  }
  return d + (d === 1 ? " day, " : " days, ") + formatHour(seconds);
};

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
