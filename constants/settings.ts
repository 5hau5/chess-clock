export type TimeFormat = "tenths" | "hundredths" | "all";

export type SubSecondThreshold =
  | "always"
  | "never"
  | "below-1min"
  | "below-30sec"
  | "below-10sec";

export interface AppSettings {
  timeFormat: TimeFormat;
  subSecondThreshold: SubSecondThreshold;
  rememberCustom: boolean;
  lastCustom?: { time: number; inc: number };
}

export const DEFAULT_SETTINGS: AppSettings = {
  timeFormat: "tenths",
  subSecondThreshold: "below-10sec",
  rememberCustom: false,
};
