import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatTime(time: string | null | undefined) {
  return dayjs.utc(time, "HH:mm").tz(dayjs.tz.guess()).format("hh:mm A");
}

export function formatLateTime(time: string | null | undefined) {
  return dayjs.utc(time, "HH:mm").tz(dayjs.tz.guess()).format("HH:mm");
}

export function calDiffTime({
  startTime,
  endTime,
}: {
  startTime: string | null | undefined;
  endTime: string | null | undefined;
}) {
  if (startTime && endTime) {
    const timeToMinutes = (t: string) => {
      const [hours, minutes] = t.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const diff = end - start;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
  } else {
    return "";
  }
}

export function calcLateTime({
  startTime,
  scanTime,
}: {
  startTime: string | null | undefined;
  scanTime: string | null | undefined;
}) {
  if (!startTime || !scanTime) return "0h 0m";
  if (!scanTime) return;

  const parseTime = (t: string) => {
    const [hoursStr, minutesStr] = t.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const scanMinutes = parseTime(scanTime);

  const diff = scanMinutes - startMinutes;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
    if(hours >= 1){
      if (diff >= 0) return `Late (${hours}h ${minutes}min )`;
    }

  if (diff >= 0) return `Late ( ${minutes}min )`;

  // if (diff <= 0) return `Early ( ${Math.abs(minutes)} min )`;
}
