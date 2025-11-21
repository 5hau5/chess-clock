import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme, Theme } from "../constants/theme";

type ThemeContextType = {
  theme: Theme;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  toggleTheme: () => void;
};

// Default placeholder values (real values come from provider).
export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  mode: "light",
  setMode: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<"light" | "dark">("light");

  // Load saved theme mode on startup.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("themeMode");
        if (saved === "dark" || saved === "light") {
          setModeState(saved);
        }
      } catch {
        // ignore storage errors
      }
    })();
  }, []);

  // Save theme mode to storage.
  const setMode = async (m: "light" | "dark") => {
    setModeState(m);
    try {
      await AsyncStorage.setItem("themeMode", m);
    } catch {
      // ignore storage errors
    }
  };

  // Convenience toggle for UI.
  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  // Select color palette based on current mode.
  const theme = mode === "light" ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
