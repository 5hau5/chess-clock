import { TimeFormat, SubSecondThreshold } from "../constants/settings";

export default function formatTime(
  sec: number,
  format: TimeFormat = "tenths",
  threshold: SubSecondThreshold = "below-10sec"
): string {
  const totalSeconds = Math.floor(sec);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let ms = 0;
  let showMs = false;

  // Determine if milliseconds should be shown
  switch (threshold) {
    case "always":
      showMs = true;
      break;
    case "never":
      showMs = false;
      break;
    case "below-1min":
      showMs = sec < 60;
      break;
    case "below-30sec":
      showMs = sec < 30;
      break;
    case "below-10sec":
      showMs = sec < 10;
      break;
  }

  if (showMs) {
    switch (format) {
      case "tenths":
        ms = Math.floor((sec - totalSeconds) * 10);
        break;
      case "hundredths":
        ms = Math.floor((sec - totalSeconds) * 100);
        break;
      case "all":
        ms = Math.floor((sec - totalSeconds) * 1000);
        break;
    }
  }

  const secStr = seconds.toString().padStart(2, "0");

  if (showMs) {
    const msStr =
      format === "hundredths"
        ? ms.toString().padStart(2, "0")
        : format === "all"
        ? ms.toString().padStart(3, "0")
        : ms.toString();
    return `${minutes}:${secStr}.${msStr}`;
  }

  return `${minutes}:${secStr}`;
}
