import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useSettings } from "../hooks/useSettings";
import { ThemeContext } from "../context/ThemeContext";
import { TimeFormat, SubSecondThreshold } from "../constants/settings";
import { haptics } from "../hooks/useHaptics";

const SUBSECOND_THRESHOLDS = [
  { label: "Never", value: "never" },
  { label: "Below 10 sec", value: "below-10sec" },
  { label: "Below 30 sec", value: "below-30sec" },
  { label: "Below 1 min", value: "below-1min" },
  { label: "Always", value: "always" },
];

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useContext(ThemeContext);
  const { settings, loaded, updateSettings } = useSettings();

  if (!loaded) return null;

  const subSecondDisabled = settings.subSecondThreshold === "never";

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Theme Switch */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: theme.card }]}
        onPress={() => { haptics.tap(); toggleTheme(); }}
      >
        <Text style={[styles.optionText, { color: theme.text }]}>
          Mode: {mode === "light" ? "Light" : "Dark"}
        </Text>
      </TouchableOpacity>

      {/* Sub-second Display */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Sub-second Display</Text>

      <Slider
        minimumValue={0}
        maximumValue={4}
        step={1}
        value={[
          "never",
          "below-10sec",
          "below-30sec",
          "below-1min",
          "always",
        ].indexOf(settings.subSecondThreshold)}
        minimumTrackTintColor={theme.buttonPrimary}
        maximumTrackTintColor={theme.cardActive}
        thumbTintColor={theme.sliderThumb}

        onSlidingStart={() => haptics.tap()}
        onValueChange={(v) => {
          const list = ["never", "below-10sec", "below-30sec", "below-1min", "always"];
          updateSettings({ subSecondThreshold: list[v] as SubSecondThreshold });
          haptics.selection(); // subtle continuous tick
        }}
        onSlidingComplete={() => haptics.medium()}
      />

      <Text style={[styles.previewText, { color: theme.text }]}>
        {SUBSECOND_THRESHOLDS.find(x => x.value === settings.subSecondThreshold)?.label}
      </Text>

      {/* Time Format */}
      <Text style={[
        styles.sectionTitle,
        { color: subSecondDisabled ? theme.subtleText : theme.text }
      ]}>
        Time Format
      </Text>

      <Slider
        minimumValue={0}
        maximumValue={2}
        step={1}
        disabled={subSecondDisabled}
        value={
          settings.timeFormat === "tenths" ? 0 :
          settings.timeFormat === "hundredths" ? 1 : 2
        }
        minimumTrackTintColor={subSecondDisabled ? theme.cardActive : theme.buttonPrimary}
        maximumTrackTintColor={theme.cardActive}
        thumbTintColor={subSecondDisabled ? theme.cardActive : theme.sliderThumb}

        onSlidingStart={() => !subSecondDisabled && haptics.tap()}
        onValueChange={(v) => {
          const map = ["tenths", "hundredths", "all"] as const;
          updateSettings({ timeFormat: map[v] });

          if (!subSecondDisabled) haptics.selection();
        }}
        onSlidingComplete={() => !subSecondDisabled && haptics.medium()}
      />

      <Text style={[
        styles.previewText,
        { color: subSecondDisabled ? theme.subtleText : theme.text }
      ]}>
        {settings.timeFormat === "tenths" && "0:00.0"}
        {settings.timeFormat === "hundredths" && "0:00.00"}
        {settings.timeFormat === "all" && "0:00.000"}
      </Text>

      {/* Remember Custom */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Custom Game</Text>
      <TouchableOpacity
        style={[
          styles.option,
          { backgroundColor: settings.rememberCustom ? theme.cardActive : theme.card }
        ]}
        onPress={() => {
          haptics.tap();
          updateSettings({ rememberCustom: !settings.rememberCustom });
        }}
      >
        <Text style={[styles.optionText, { color: theme.text }]}>
          Remember last custom time & increment
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "stretch",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 10,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  previewText: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 16,
  },
});
