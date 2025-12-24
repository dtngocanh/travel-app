import React, { useLayoutEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useNotification } from "../../src/contexts/NotificationContext";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotification();

  const navigation = useNavigation();
  const router = useRouter();

 useLayoutEffect(() => {
    navigation.setOptions({
      title: "Notifications",
      headerTitleAlign: "left",
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  return (
    <View className="flex-1 bg-white p-5">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => { markAsRead(item.id);  }}
            className={`flex-row items-center p-4 mb-3 rounded-lg ${item.read ? 'bg-gray-200' : 'bg-yellow-500'}`}
          >
            <View>
              <Text className={`${item.read ? 'text-gray-700' : 'text-white'} text-sm`}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
