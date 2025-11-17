import React, { useState, useEffect, useRef, useContext } from "react";
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

type CustomTimeModalProps = {
  visible: boolean;
  onClose: () => void;
  onStart: (time: number, inc: number) => void;
};

export default function CustomTimeModal({ visible, onClose, onStart }: CustomTimeModalProps) {
  const { theme } = useContext(ThemeContext);
  const { settings, updateSettings } = useSettings();

  const [base, setBase] = useState(settings.rememberCustom && settings.lastCustom ? settings.lastCustom.time : 300);
  const [inc, setInc] = useState(settings.rememberCustom && settings.lastCustom ? settings.lastCustom.inc : 0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Haptic refs
  const lastBaseIndex = useRef<number | null>(null);
  const lastInc = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      // Reset animation
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 120, useNativeDriver: true }),
      ]).start();

      // Load last custom values if rememberCustom is enabled
      if (settings.rememberCustom && settings.lastCustom) {
        setBase(settings.lastCustom.time);
        setInc(settings.lastCustom.inc);
      } else {
        setBase(300);
        setInc(0);
      }

      // Reset haptic refs for sliders
      lastBaseIndex.current = null;
      lastInc.current = null;
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, settings.rememberCustom, settings.lastCustom]);


  const sliderMax = TIME_STEPS.length - 1;
  const currentIndex = TIME_STEPS.findIndex((s) => s === base);

  const handleBaseChange = (value: number) => {
    const idx = Math.round(value);

    if (lastBaseIndex.current !== idx) {
      haptics.selection();
      lastBaseIndex.current = idx;
    }

    setBase(TIME_STEPS[idx]);
  };

  const handleInc = (value: number) => {
    if (lastInc.current !== value) {
      haptics.selection();
      lastInc.current = value;
    }
    setInc(value);
  };

  const handleStart = () => {
    if (settings.rememberCustom) {
      updateSettings({
        ...settings,       
        lastCustom: { time: base, inc }
      });
    }
    onStart(base, inc);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalBackground, { backgroundColor: theme.modalBackground, opacity: fadeAnim }]}>
        <Pressable style={styles.pressableArea} onPress={() => { haptics.tap(); onClose(); }}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, { backgroundColor: theme.modalCard, transform: [{ scale: scaleAnim }] }]}>

              <Text style={[styles.modalTitle, { color: theme.text }]}>Custom Time</Text>

              <Text style={[styles.label, { color: theme.text }]}>Base Time: {formatTime(base)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={sliderMax}
                step={1}
                value={currentIndex >= 0 ? currentIndex : 0}
                minimumTrackTintColor={theme.buttonPrimary}
                maximumTrackTintColor={theme.cardActive}
                thumbTintColor={theme.sliderThumb}
                onValueChange={handleBaseChange}
              />

              <Text style={[styles.label, { color: theme.text }]}>Increment: {inc} sec</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={30}
                step={1}
                value={inc}
                onValueChange={handleInc}
                minimumTrackTintColor={theme.buttonPrimary}
                maximumTrackTintColor={theme.cardActive}
                thumbTintColor={theme.sliderThumb}
              />

              <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonPrimary }]} onPress={() => { haptics.tap(); handleStart(); }}>
                <Text style={[styles.text, { color: "#fff" }]}>Start Game</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonSecondary }]} onPress={() => { haptics.tap(); onClose(); }}>
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
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginTop: 15 },
  slider: { width: "100%", height: 40 },
  button: { padding: 12, borderRadius: 10, marginTop: 12, alignItems: "center" },
  text: { fontSize: 16 },
});
