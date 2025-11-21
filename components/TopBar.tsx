import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { haptics } from "../hooks/useHaptics";

interface TopBarProps {
  // List of routes that should display this top bar.
  pagesWithBar: string[];
}

export default function TopBar({ pagesWithBar }: TopBarProps) {
  const { theme } = useContext(ThemeContext);
  const pathname = usePathname();
  const router = useRouter();

  // Hide the bar entirely on screens not included.
  if (!pagesWithBar.includes(pathname)) return null;

  // Simple map for readable titles.
  const pageTitles: Record<string, string> = {
    "/": "Chess Cock",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[pathname];

  return (
    <View style={[styles.container, { backgroundColor: theme.safeAreaColor }]}>
      <Text style={[styles.title, { color: theme.text }]}>{pageTitle}</Text>

      {/* Settings button (toggles based on current route) */}
      <TouchableOpacity
        onPress={() => {
          haptics.tap();
          if (pathname === "/settings") router.push("/");
          else router.push("/settings");
        }}
      >
        <MaterialIcons
          name="settings"
          size={28}
          color={pathname === "/settings" ? theme.iconDimmed : theme.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  title: { fontSize: 28, fontWeight: "600" },
});
