// Shared theme structure for both Dark and Light modes.
export type Theme = {
  background: string;
  text: string;
  card: string;
  cardActive: string;
  modalBackground: string;
  modalCard: string;
  buttonPrimary: string;
  buttonSecondary: string;
  subtleText: string;
  safeAreaColor: string;
  iconDimmed: string;
  accent: string;
  sliderThumb: string;
  clockActive: string;
  clockInactive: string;
};

// Light mode color palette.
export const LightTheme: Theme = {
  background: "#fff2dcff",
  text: "#120e07ff",
  card: "#ffe9c3ff",
  cardActive: "#bbab8fff",
  modalBackground: "rgba(0,0,0,0.5)",
  modalCard: "#fff2dcff",
  buttonPrimary: "#bb8b47ff",
  buttonSecondary: "#61401bff",
  subtleText: "#876533ff",
  safeAreaColor: "#ffe1baff",
  iconDimmed: "#ad9374ff",
  accent: "#ffab52ff",
  sliderThumb: "#ffbc5fff",
  clockActive: "#ffe9c3ff",
  clockInactive: "#bbab8fff",
};

// Dark mode color palette.
export const DarkTheme: Theme = {
  background: "#312126ff",
  text: "#FFFFFF",
  card: "#39262dff",
  cardActive: "#634453ff",
  modalBackground: "rgba(255, 255, 255, 0.12)",
  modalCard: "#311c23ff",
  buttonPrimary: "#b22766ff",
  buttonSecondary: "#7b626cff",
  subtleText: "#AAAAAA",
  safeAreaColor: "#1b1419ff",
  iconDimmed: "#666666",
  accent: "#a43362ff",
  sliderThumb: "#a12e5aff",
  clockActive: "#634453ff",
  clockInactive: "#39262dff",
};
