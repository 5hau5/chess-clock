// Dynamic time slider steps for selecting custom clock durations.
// Values are in seconds and become coarser as time increases.
export const TIME_STEPS = [
  // 15s–2min (every 15s)
  ...Array.from({ length: 8 }, (_, i) => 15 + i * 15),

  // 2–5min (every 30s)
  ...Array.from({ length: 5 }, (_, i) => 120 + i * 30),

  // 5–15min (every 1min)
  ...Array.from({ length: 11 }, (_, i) => 300 + i * 60),

  // 15–30min (every 5min)
  ...Array.from({ length: 4 }, (_, i) => 900 + i * 300),
];
