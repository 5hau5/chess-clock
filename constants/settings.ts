// How sub-second time is displayed (e.g., 0.1 or 0.01 precision).
export type TimeFormat = "tenths" | "hundredths" | "all";

// When to show sub-second display below certain thresholds.
export type SubSecondThreshold =
  | "always"
  | "never"
  | "below-1min"
  | "below-30sec"
  | "below-10sec";

// All user-configurable app settings saved in storage.
export interface AppSettings {
  timeFormat: TimeFormat;
  subSecondThreshold: SubSecondThreshold;
  rememberCustom: boolean;
  lastCustom?: { time: number; inc: number }; // Used only if rememberCustom = true
}

// Default settings applied on first launch.
export const DEFAULT_SETTINGS: AppSettings = {
  timeFormat: "tenths",
  subSecondThreshold: "below-10sec",
  rememberCustom: false,
};
