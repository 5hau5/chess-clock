// app/custom.tsx
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import Slider from "@react-native-community/slider";
import { TIME_STEPS } from "../constants/timeSteps";
import formatTime from "../utils/formatTime";
import { ThemeContext } from "../context/ThemeContext";
import { useSettings } from "../hooks/useSettings";
import { haptics } from "../hooks/useHaptics";

/**
 * CustomTimeModal
 * - Allows picking a base time (from TIME_STEPS) and an increment
 * - Honors settings.rememberCustom and persists lastCustom via updateSettings
 * - Haptic feedback for slider ticks + button presses
 */

type Props = {
  visible: boolean;
  onClose: () => void;
  onStart: (time: number, inc: number) => void;
};

export default function CustomTimeModal({ visible, onClose, onStart }: Props) {
  const { theme } = useContext(ThemeContext);
  const { settings, updateSettings } = useSettings();

  // initialize to last custom if settings.rememberCustom is enabled
  const [base, setBase] = useState<number>(
    settings.rememberCustom && settings.lastCustom ? settings.lastCustom.time : TIME_STEPS[Math.floor(TIME_STEPS.length / 2)] ?? 300
  );
  const [inc, setInc] = useState<number>(settings.rememberCustom && settings.lastCustom ? settings.lastCustom.inc : 0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Haptic tracking so we don't spam selection haptics on same value
  const lastBaseIndex = useRef<number | null>(null);
  const lastInc = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      // reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 120, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }),
      ]).start();

      // load saved lastCustom when modal opens
      if (settings.rememberCustom && settings.lastCustom) {
        setBase(settings.lastCustom.time);
        setInc(settings.lastCustom.inc);
      } else {
        // pick a reasonable default if no saved value
        setBase(TIME_STEPS[Math.floor(TIME_STEPS.length / 2)] ?? 300);
        setInc(0);
      }
      lastBaseIndex.current = null;
      lastInc.current = null;
    } else {
      // animate out
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, settings.rememberCustom, settings.lastCustom, fadeAnim, scaleAnim]);

  const sliderMax = TIME_STEPS.length - 1;
  const currentIndex = Math.max(0, TIME_STEPS.findIndex((s) => s === base));

  function handleBaseChange(value: number) {
    const idx = Math.round(value);
    if (lastBaseIndex.current !== idx) {
      haptics.selection();
      lastBaseIndex.current = idx;
    }
    setBase(TIME_STEPS[idx]);
  }

  function handleIncChange(value: number) {
    const v = Math.round(value);
    if (lastInc.current !== v) {
      haptics.selection();
      lastInc.current = v;
    }
    setInc(v);
  }

  function handleStart() {
    // persist last custom if enabled
    if (settings.rememberCustom) {
      // updateSettings expects Partial<AppSettings>
      updateSettings({ lastCustom: { time: base, inc } });
    }
    onStart(base, inc);
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalBackground, { opacity: fadeAnim, backgroundColor: theme.modalBackground }]}>
        <Pressable style={styles.pressableArea} onPress={() => { haptics.tap(); onClose(); }}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }], backgroundColor: theme.modalCard }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Custom Time</Text>

              <Text style={[styles.label, { color: theme.text }]}>Base Time: {formatTime(base)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={sliderMax}
                step={1}
                value={currentIndex}
                minimumTrackTintColor={theme.buttonPrimary}
                maximumTrackTintColor={theme.cardActive}
                thumbTintColor={theme.sliderThumb}
                onValueChange={handleBaseChange}
                onSlidingStart={() => haptics.tap()}
                onSlidingComplete={() => haptics.medium()}
              />

              <Text style={[styles.label, { color: theme.text }]}>Increment: {inc} sec</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={30}
                step={1}
                value={inc}
                minimumTrackTintColor={theme.buttonPrimary}
                maximumTrackTintColor={theme.cardActive}
                thumbTintColor={theme.sliderThumb}
                onValueChange={handleIncChange}
                onSlidingStart={() => haptics.tap()}
                onSlidingComplete={() => haptics.medium()}
              />

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.buttonPrimary }]}
                onPress={() => { haptics.tap(); handleStart(); }}
              >
                <Text style={[styles.text, { color: "#fff" }]}>Start Game</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.buttonSecondary }]}
                onPress={() => { haptics.tap(); onClose(); }}
              >
                <Text style={[styles.text, { color: "#fff" }]}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  pressableArea: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", borderRadius: 15, padding: 20, alignItems: "stretch", elevation: 6 },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 16, marginTop: 12 },
  slider: { width: "100%", height: 40, marginTop: 6 },
  button: { padding: 12, borderRadius: 10, marginTop: 12, alignItems: "center" },
  text: { fontSize: 16 },
});
