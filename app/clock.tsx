import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useRef, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { useSettings } from "../hooks/useSettings";
import formatTime from "../utils/formatTime";
import { haptics } from "../hooks/useHaptics";
import Icon from "react-native-vector-icons/MaterialIcons"; 

export default function ClockScreen() {
  const { theme } = useContext(ThemeContext);
  const { settings } = useSettings();
  const params = useLocalSearchParams();

  const base = Number(params.time) || 300;
  const increment = Number(params.inc) || 0;

  const [white, setWhite] = useState(base);
  const [black, setBlack] = useState(base);
  const [turn, setTurn] = useState<"white" | "black" | null>(null);
  const [paused, setPaused] = useState(false);
  const [whiteLost, setWhiteLost] = useState(false);
  const [blackLost, setBlackLost] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUpdate = useRef(Date.now());
  const whiteTimer = useRef<number>(base);
  const blackTimer = useRef<number>(base);

  useEffect(() => {
    if (!turn || paused) return;

    lastUpdate.current = Date.now();
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdate.current) / 1000;
      lastUpdate.current = now;

      if (turn === "white") {
        whiteTimer.current -= delta;
        const remaining = Math.max(whiteTimer.current, 0);
        setWhite(remaining);
        if (remaining <= 0 && !whiteLost) {
          setWhiteLost(true);
          Vibration.vibrate(50);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTurn(null);
        }
      } else if (turn === "black") {
        blackTimer.current -= delta;
        const remaining = Math.max(blackTimer.current, 0);
        setBlack(remaining);
        if (remaining <= 0 && !blackLost) {
          setBlackLost(true);
          Vibration.vibrate(50);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTurn(null);
        }
      }
    }, 16);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [turn, paused]);

  function handlePress(side: "white" | "black") {
    // stop clicks if the game ended or paused
    if (paused || (turn === null && (white <= 0 || black <= 0))) return;

    if (!turn) {
      setTurn(side === "white" ? "black" : "white");
      return;
    }

    if (turn === side) {
      if (turn === "white") {
        whiteTimer.current += increment;
        setWhite((t) => t + increment);
        setTurn("black");
      } else {
        blackTimer.current += increment;
        setBlack((t) => t + increment);
        setTurn("white");
      }
    }
    haptics.tap();
  }

  function togglePause() {
    setPaused((p) => !p);
    haptics.tap();
  }

  function restartGame() {
    setWhite(base);
    setBlack(base);
    whiteTimer.current = base;
    blackTimer.current = base;
    setTurn(null);
    setWhiteLost(false);
    setBlackLost(false);
    setPaused(false);
    haptics.tap();
  }

  const formatClock = (t: number) =>
    formatTime(t, settings.timeFormat, settings.subSecondThreshold);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* White Timer */}
      <TouchableOpacity
        style={[
          styles.timer,
          { 
            backgroundColor: turn === "white" ? theme.clockActive : theme.clockInactive ,
            borderColor: whiteLost ? "rgba(255,0,0,0.4)" : "transparent",
            borderWidth: whiteLost ? 5 : 0
          },
        ]}
        onPress={() => handlePress("white")}
      >
        <Text
          style={[
            styles.time,
            {
              color: theme.text,
              transform: [{ scaleY: -1 }, { scaleX: -1 }], // flipped
              fontSize: 77, // slightly bigger x1.1
            },
          ]}
        >
          {formatClock(white)}
        </Text>
      </TouchableOpacity>

      {/* Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity style={styles.controlButton} onPress={togglePause}>
          <Icon name={paused ? "play-arrow" : "pause"} size={32} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={restartGame}>
          <Icon name="refresh" size={32} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Black Timer */}
      <TouchableOpacity
        style={[
          styles.timer,
          { 
            backgroundColor: turn === "black" ? theme.clockActive : theme.clockInactive,
            borderColor: blackLost ? "rgba(255,0,0,0.4)" : "transparent",
            borderWidth: blackLost ? 15 : 0
          },
        ]}
        onPress={() => handlePress("black")}
      >
        <Text style={[styles.time, { color: theme.text, fontSize: 77 }]}>
          {formatClock(black)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  timer: { flex: 1, alignItems: "center", justifyContent: "center" },
  time: { fontWeight: "bold" },
  controlBar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10 },
  controlButton: { padding: 12, borderRadius: 10 },
});
