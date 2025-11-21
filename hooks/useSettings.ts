import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, DEFAULT_SETTINGS } from "../constants/settings";

export function useSettings() {
  // Full settings object (persisted).
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Marks when initial load from storage is done.
  const [loaded, setLoaded] = useState(false);

  // Load saved settings on app start.
  useEffect(() => {
    AsyncStorage.getItem("appSettings").then((raw) => {
      if (raw) setSettings(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  // Update settings and save them to storage.
  const updateSettings = (update: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...update };
    setSettings(newSettings);
    AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  return { settings, loaded, updateSettings };
}
