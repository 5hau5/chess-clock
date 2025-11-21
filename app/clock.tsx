// app/clock.tsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Platform,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { useSettings } from "../hooks/useSettings";
import formatTime from "../utils/formatTime";
import { haptics } from "../hooks/useHaptics";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * Chess clock screen.
 *
 * Responsibilities:
 *  - Start / stop / switch sides
 *  - Accurate countdown using delta time (Date.now)
 *  - Pause / restart controls
 *  - Small vibration when a side runs out of time
 *  - Soft red border when a side has "lost"
 *
 * Notes / decisions:
 *  - We keep precise remaining time in refs (whiteTimerRef/blackTimerRef)
 *    and mirror to state for rendering. This avoids setInterval rounding drift.
 *  - intervalRef typed using ReturnType<typeof setInterval> for cross-platform safety.
 */

type Turn = "white" | "black" | null;

export default function ClockScreen() {
  const { theme } = useContext(ThemeContext);
  const { settings } = useSettings();
  const params = useLocalSearchParams();

  // query params fallback (defaults)
  const base = Number(params.time) || 300;
  const increment = Number(params.inc) || 0;

  // UI states (number = remaining seconds, can be fractional)
  const [white, setWhite] = useState<number>(base);
  const [black, setBlack] = useState<number>(base);
  const [turn, setTurn] = useState<Turn>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const [whiteLost, setWhiteLost] = useState<boolean>(false);
  const [blackLost, setBlackLost] = useState<boolean>(false);

  // refs for the actual timers and scheduling
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const whiteTimerRef = useRef<number>(base);
  const blackTimerRef = useRef<number>(base);

  // start/stop effect for the ticking loop
  useEffect(() => {
    // Do not run if paused, nobody's turn, or someone already lost
    if (!turn || paused || whiteLost || blackLost) return;

    // initialize timing
    lastUpdateRef.current = Date.now();

    // clear any previous interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // run; small interval (~60fps) using delta time for accuracy
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdateRef.current) / 1000; // seconds
      lastUpdateRef.current = now;

      if (turn === "white") {
        whiteTimerRef.current -= delta;
        const remaining = Math.max(whiteTimerRef.current, 0);
        setWhite(remaining);

        if (remaining <= 0 && !whiteLost) {
          setWhiteLost(true);
          // short vibration to indicate loss
          Vibration.vibrate(50);
          // stop the clock
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTurn(null);
        }
      } else if (turn === "black") {
        blackTimerRef.current -= delta;
        const remaining = Math.max(blackTimerRef.current, 0);
        setBlack(remaining);

        if (remaining <= 0 && !blackLost) {
          setBlackLost(true);
          Vibration.vibrate(50);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTurn(null);
        }
      }
    }, 16);

    // cleanup when turn changes or component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // turn/paused/whiteLost/blackLost control when effect runs
  }, [turn, paused, whiteLost, blackLost]);

  // make sure timers are persisted to refs when user restarts or incrementing
  useEffect(() => {
    whiteTimerRef.current = white;
  }, [white]);

  useEffect(() => {
    blackTimerRef.current = black;
  }, [black]);

  // user presses a side
  function handlePress(side: "white" | "black") {
    // Do nothing if paused or game already finished
    if (paused || (turn === null && (white <= 0 || black <= 0))) return;

    // start: first tap starts the opposite side
    if (!turn) {
      setTurn(side === "white" ? "black" : "white");
      haptics.tap();
      return;
    }

    // only allow pressing the active side to finish your move
    if (turn === side) {
      if (turn === "white") {
        whiteTimerRef.current += increment;
        setWhite((t) => t + increment);
        setTurn("black");
      } else {
        blackTimerRef.current += increment;
        setBlack((t) => t + increment);
        setTurn("white");
      }
      haptics.tap();
    }
  }

  // toggle paused (pausing prevents further switching)
  function togglePause() {
    setPaused((p) => !p);
    haptics.tap();
  }

  // restart everything
  function restartGame() {
    whiteTimerRef.current = base;
    blackTimerRef.current = base;
    setWhite(base);
    setBlack(base);
    setTurn(null);
    setWhiteLost(false);
    setBlackLost(false);
    setPaused(false);
    haptics.tap();
  }

  // format using your existing util (it understands format + threshold)
  const formatClock = (t: number) => formatTime(t, settings.timeFormat, settings.subSecondThreshold);

  // small helper for border style on lost side
  const lostBorderStyle = (lost: boolean) =>
    lost ? { borderColor: "rgba(255,0,0,0.35)", borderWidth: 6 } : { borderColor: "transparent", borderWidth: 0 };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top (white) timer — text flipped so opponent sees it properly */}
      <TouchableOpacity
        activeOpacity={0.95}
        style={[
          styles.timer,
          { backgroundColor: turn === "white" ? theme.clockActive : theme.clockInactive },
          lostBorderStyle(whiteLost),
        ]}
        onPress={() => handlePress("white")}
      >
        <Text
          style={[
            styles.time,
            {
              color: theme.text,
              transform: [{ scaleY: -1 }, { scaleX: -1 }], // flipped for opponent
              fontSize: 77,
            },
          ]}
        >
          {formatClock(white)}
        </Text>
      </TouchableOpacity>

      {/* control bar (between timers) */}
      <View style={[styles.controlBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          accessibilityLabel={paused ? "Resume" : "Pause"}
          accessibilityRole="button"
          style={styles.controlButton}
          onPress={() => {
            togglePause();
          }}
        >
          <Icon name={paused ? "play-arrow" : "pause"} size={28} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Restart game"
          accessibilityRole="button"
          style={styles.controlButton}
          onPress={() => {
            restartGame();
          }}
        >
          <Icon name="refresh" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom (black) timer */}
      <TouchableOpacity
        activeOpacity={0.95}
        style={[
          styles.timer,
          { backgroundColor: turn === "black" ? theme.clockActive : theme.clockInactive },
          lostBorderStyle(blackLost),
        ]}
        onPress={() => handlePress("black")}
      >
        <Text style={[styles.time, { color: theme.text, fontSize: 77 }]}>{formatClock(black)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  timer: { flex: 1, alignItems: "center", justifyContent: "center" },
  time: { fontWeight: "bold", textAlign: "center" },
  controlBar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 8 },
  controlButton: { padding: 10, borderRadius: 8 },
});
