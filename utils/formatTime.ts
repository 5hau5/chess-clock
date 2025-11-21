import { TimeFormat, SubSecondThreshold } from "../constants/settings";

export default function formatTime(
  sec: number,
  format: TimeFormat = "tenths",
  threshold: SubSecondThreshold = "below-10sec"
): string {
  const totalSeconds = Math.floor(sec);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const fractional = sec - totalSeconds;

  // Determine if ms should be shown
  const showMs = {
    always: true,
    never: false,
    "below-1min": sec < 60,
    "below-30sec": sec < 30,
    "below-10sec": sec < 10,
  }[threshold];

  let ms = 0;
  if (showMs) {
    const multipliers = {
      tenths: 10,
      hundredths: 100,
      all: 1000,
    };
    ms = Math.floor(fractional * multipliers[format]);
  }

  const secStr = seconds.toString().padStart(2, "0");

  if (!showMs) {
    return `${minutes}:${secStr}`;
  }

  // Build ms string
  const msPad = {
    tenths: 1,
    hundredths: 2,
    all: 3,
  }[format];

  const msStr = ms.toString().padStart(msPad, "0");

  return `${minutes}:${secStr}.${msStr}`;
}
