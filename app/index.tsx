// app/index.tsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import PRESETS from "../constants/presets";
import CustomTimeModal from "./custom";
import { ThemeContext } from "../context/ThemeContext";
import { haptics } from "../hooks/useHaptics";

/**
 * Home screen / preset picker
 * - Uses router.push to open /clock with query string params
 * - Uses CustomTimeModal for custom game creation
 */

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStartCustom = (time: number, inc: number) => {
    setModalVisible(false);
    router.push(`/clock?time=${time}&inc=${inc}`);
  };

  return (
    <ScrollView style={[{ backgroundColor: theme.background }]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Choose type</Text>

      <View style={styles.grid}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.button, { backgroundColor: theme.card }]}
            onPress={() => {
              haptics.tap();
              router.push(`/clock?time=${p.time}&inc=${p.inc}`);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Start ${p.label}`}
          >
            <Text style={[styles.text, { color: theme.text }]}>{p.label}</Text>
            <Text style={[styles.gametype, { color: theme.subtleText }]}>{p.type}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, styles.customButton, { backgroundColor: theme.card }]}
          onPress={() => { haptics.tap(); setModalVisible(true); }}
          accessibilityRole="button"
          accessibilityLabel="Custom game"
        >
          <Text style={[styles.text, { color: theme.text }]}>Custom</Text>
        </TouchableOpacity>
      </View>

      <CustomTimeModal visible={modalVisible} onClose={() => setModalVisible(false)} onStart={handleStartCustom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 10, marginTop: 20 },
  grid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  button: {
    flexBasis: "48%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  customButton: {},
  text: { fontSize: 20 },
  gametype: { fontSize: 16, marginTop: 5 },
});
