// Time steps in seconds
export const TIME_STEPS = [
  ...Array.from({ length: 8 }, (_, i) => 15 + i * 15),     // 15s - 2min (15s steps)
  ...Array.from({ length: 5 }, (_, i) => 120 + i * 30),    // 2min - 5min (30s steps)
  ...Array.from({ length: 11 }, (_, i) => 300 + i * 60),   // 5min - 15min (1min steps)
  ...Array.from({ length: 4 }, (_, i) => 900 + i * 300),   // 15min - 30min (5min steps)
];
