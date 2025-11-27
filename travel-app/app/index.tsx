import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../src/contexts/AuthContex";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('loading', loading, 'user', user);
    if (loading) return;

    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (user.role === "customer") {
      router.replace("/(customer)");
    } else if (user.role === "admin") {
      router.replace("/(admin)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [loading, user]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
