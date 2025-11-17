import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, DEFAULT_SETTINGS } from "../constants/settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("appSettings").then((raw) => {
      if (raw) setSettings(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const updateSettings = (update: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...update };
    setSettings(newSettings);
    AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  return { settings, loaded, updateSettings };
}
