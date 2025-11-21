// app/settings.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useSettings } from "../hooks/useSettings";
import { ThemeContext } from "../context/ThemeContext";
import { TimeFormat, SubSecondThreshold } from "../constants/settings";
import { haptics } from "../hooks/useHaptics";

/**
 * Settings screen:
 *  - Theme toggle
 *  - Sub-second threshold slider (never / below 10s / 30s / 1min / always)
 *  - Time format slider (tenths / hundredths / milliseconds) — disabled when sub-second is "never"
 *  - Preview lines that show how the formatting will look
 *
 * UX:
 *  - Sliders produce subtle haptic feedback while changing, stronger on release
 *  - Saves to AsyncStorage through useSettings hook
 */

const SUBSECOND_ORDER: { label: string; value: SubSecondThreshold }[] = [
  { label: "Never", value: "never" },
  { label: "Below 10 sec", value: "below-10sec" },
  { label: "Below 30 sec", value: "below-30sec" },
  { label: "Below 1 min", value: "below-1min" },
  { label: "Always", value: "always" },
];

const TIME_FORMAT_ORDER: { label: string; value: TimeFormat }[] = [
  { label: "Tenths (0:00.0)", value: "tenths" },
  { label: "Hundredths (0:00.00)", value: "hundredths" },
  { label: "All ms (0:00.000)", value: "all" },
];

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useContext(ThemeContext);
  const { settings, loaded, updateSettings } = useSettings();

  if (!loaded) return null;

  const subSecondDisabled = settings.subSecondThreshold === "never";

  // helpers to map slider index -> enum value
  const subList = SUBSECOND_ORDER.map((s) => s.value);
  const formatList = TIME_FORMAT_ORDER.map((f) => f.value);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      {/* Theme */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: theme.card }]}
        onPress={() => { haptics.tap(); toggleTheme(); }}
      >
        <Text style={[styles.optionText, { color: theme.text }]}>Mode: {mode === "light" ? "Light" : "Dark"}</Text>
      </TouchableOpacity>

      {/* Sub-second threshold slider */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Sub-second Display</Text>
      <Slider
        minimumValue={0}
        maximumValue={subList.length - 1}
        step={1}
        value={subList.indexOf(settings.subSecondThreshold)}
        minimumTrackTintColor={theme.buttonPrimary}
        maximumTrackTintColor={theme.cardActive}
        thumbTintColor={theme.sliderThumb}
        onSlidingStart={() => haptics.tap()}
        onValueChange={(v) => {
          const newVal = subList[Math.round(v)];
          updateSettings({ subSecondThreshold: newVal });
          haptics.selection();
        }}
        onSlidingComplete={() => haptics.medium()}
      />
      <Text style={[styles.previewText, { color: theme.text }]}>
        {SUBSECOND_ORDER.find((s) => s.value === settings.subSecondThreshold)?.label}
      </Text>

      {/* Time format (disabled if sub-second = never) */}
      <Text style={[styles.sectionTitle, { color: subSecondDisabled ? theme.subtleText : theme.text }]}>Time Format</Text>
      <Slider
        minimumValue={0}
        maximumValue={formatList.length - 1}
        step={1}
        disabled={subSecondDisabled}
        value={formatList.indexOf(settings.timeFormat)}
        minimumTrackTintColor={subSecondDisabled ? theme.cardActive : theme.buttonPrimary}
        maximumTrackTintColor={theme.cardActive}
        thumbTintColor={subSecondDisabled ? theme.cardActive : theme.sliderThumb}
        onSlidingStart={() => !subSecondDisabled && haptics.tap()}
        onValueChange={(v) => {
          const val = formatList[Math.round(v)];
          updateSettings({ timeFormat: val });
          if (!subSecondDisabled) haptics.selection();
        }}
        onSlidingComplete={() => !subSecondDisabled && haptics.medium()}
      />
      <Text style={[styles.previewText, { color: subSecondDisabled ? theme.subtleText : theme.text }]}>
        {settings.timeFormat === "tenths" && "0:00.0"}
        {settings.timeFormat === "hundredths" && "0:00.00"}
        {settings.timeFormat === "all" && "0:00.000"}
      </Text>

      {/* Remember custom */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Custom Game</Text>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: settings.rememberCustom ? theme.cardActive : theme.card }]}
        onPress={() => {
          haptics.tap();
          updateSettings({ rememberCustom: !settings.rememberCustom });
        }}
      >
        <Text style={[styles.optionText, { color: theme.text }]}>Remember last custom time & increment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, alignItems: "stretch", paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginTop: 6, marginBottom: 10 },
  option: { padding: 15, borderRadius: 10, marginBottom: 10 },
  optionText: { fontSize: 16 },
  previewText: { marginTop: 4, marginBottom: 12, fontSize: 16 },
});
