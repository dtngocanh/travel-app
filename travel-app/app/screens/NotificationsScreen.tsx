import React, { useLayoutEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useNotification } from "../../src/contexts/NotificationContext";

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotification();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Notifications",
    });
  }, []);
  
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
