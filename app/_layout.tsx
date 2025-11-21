// app/_layout.tsx
import { Slot } from "expo-router";
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import TopBar from "../components/TopBar";

/**
 * Layout wrapper that:
 *  - Provides theme & safe-area
 *  - Renders a top "bar" only on selected routes (TopBar handles visibility)
 *  - Ensures left/right content is safe using SafeAreaView edges
 *
 * Note: TopBar is kept as a separate component.
 */
function LayoutContent() {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* top phone safe area colored independently */}
      <View style={[styles.safeAreaTop, { height: insets.top, backgroundColor: theme.safeAreaColor }]} />

      {/* top bar (TopBar decides whether to render contents based on the route) */}
      <TopBar pagesWithBar={["/", "/settings"]} />

      {/* main app content (left/right insets handled here) */}
      <SafeAreaView style={styles.content} edges={["left", "right", "bottom"]}>
        <Slot />
      </SafeAreaView>

      {/* bottom safe area colored independently */}
      <View style={[styles.safeAreaBottom, { height: insets.bottom, backgroundColor: theme.safeAreaColor }]} />
    </View>
  );
}

/**
 * App-level exported layout: wraps children with ThemeProvider & SafeAreaProvider.
 */
export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <LayoutContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeAreaTop: { width: "100%" },
  safeAreaBottom: { width: "100%" },
  content: { flex: 1 },
});
