import { Slot } from "expo-router";
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import TopBar from "../components/TopBar";

function LayoutContent() {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ height: insets.top, backgroundColor: theme.safeAreaColor }} />
      <TopBar pagesWithBar={["/", "/settings"]} />
      <SafeAreaView style={[styles.content]} edges={["left", "right"]}>
        <Slot />
      </SafeAreaView>
      <View style={{ height: insets.bottom, backgroundColor: theme.safeAreaColor }} />
    </View>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <LayoutContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({ content: { flex: 1 } });
