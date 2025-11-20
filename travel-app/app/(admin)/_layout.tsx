import React from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Tabs, useRouter, usePathname, Slot } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";

// Định nghĩa literal paths hợp lệ cho TS
type MenuPath = "/home" | "/userlist";

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width > 768; // web nếu rộng > 768px
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại trên web

  // Danh sách menu sidebar / tab
  const menuItems: { path: MenuPath; label: string; icon: string }[] = [
    { path: "/home", label: "Home", icon: "home-outline" },
    { path: "/userlist", label: "Manage User", icon: "person-outline" },
  ];

  // -------------------- WEB LAYOUT (SIDEBAR) --------------------
  if (isWeb) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {menuItems.map((item) => (
            <Pressable
              key={item.path}
              style={[
                styles.menuItem,
                pathname === item.path && styles.menuItemActive, // highlight active menu
              ]}
              onPress={() => router.push(item.path)}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={pathname === item.path ? "#F59E0B" : "#000"}
              />
              <Text
                style={[
                  styles.menuLabel,
                  pathname === item.path && {
                    color: "#F59E0B",
                    fontWeight: "700",
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Nội dung màn hình con */}
        <View style={styles.content}>
          <Slot /> {/* render màn hình con tương ứng route */}
        </View>
      </View>
    );
  }

  // -------------------- MOBILE LAYOUT (TABS) --------------------
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="userlist"
        options={{
          title: "Manage User",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="_userdetail"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="_addusermodal"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: "#f3f4f6",
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemActive: {
    backgroundColor: "#e0e7ff",
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
