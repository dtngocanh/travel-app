import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { Tabs, useRouter, usePathname, Slot } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { useAuth } from "../../src/contexts/AuthContex";

// 1. Cập nhật thêm đường dẫn /bookinglist vào Type
type MenuPath = "/home" | "/userlist" | "/latesttour" | "/bookinglist";

type MenuItem = {
  path?: MenuPath;
  label: string;
  icon: string;
  action?: () => void;
};

export default function AdminLayout() {
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width > 768;
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (err) {
      console.log('Logout error:', err);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  // 2. Thêm "Manage Bookings" vào danh sách menuItems
  const menuItems: MenuItem[] = [
    { path: "/home", label: "Home", icon: "home-outline" },
    { path: "/bookinglist", label: "Manage Bookings", icon: "receipt-outline" }, // Thêm mới
    { path: "/userlist", label: "Manage User", icon: "person-outline" },
    { path: "/latesttour", label: "Manage Tours", icon: "calendar-outline" },
    { label: "Logout", icon: "log-out-outline", action: handleLogout },
  ];

  // -------------------- WEB LAYOUT (SIDEBAR) --------------------
  if (isWeb) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.sidebar}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.path || index.toString()}
              style={[
                styles.menuItem,
                pathname === item.path && styles.menuItemActive,
              ]}
              onPress={() => {
                if (item.action) item.action();
                else if (item.path) router.push(item.path);
              }}
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

        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    );
  }

  // -------------------- MOBILE LAYOUT (TABS) --------------------
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerRight: () => (
            <Pressable onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="#B91C1C" />
            </Pressable>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Thêm Tabs.Screen cho bookinglist trên Mobile */}
      <Tabs.Screen
        name="bookinglist"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="latesttour"
        options={{
          title: "Tours",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="userlist"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Các màn hình ẩn (href: null) */}
      <Tabs.Screen name="_userdetail" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="_addusermodal" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="_createtourmodal" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="_updatetourmodal" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: "#f3f4f6",
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});