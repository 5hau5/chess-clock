import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme, Theme } from "../constants/theme";

type ThemeContextType = {
  theme: Theme;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  mode: "light",
  setMode: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("themeMode");
        if (saved === "dark" || saved === "light") {
          setModeState(saved);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const setMode = async (m: "light" | "dark") => {
    setModeState(m);
    try {
      await AsyncStorage.setItem("themeMode", m);
    } catch (e) {
      // ignore
    }
  };

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  const theme = mode === "light" ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
