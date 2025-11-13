import React from "react";
import { View, Text } from "react-native";

const AdminHomeScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 justify-center items-center">
      <Text className="text-3xl font-bold text-black dark:text-white mb-2">
        Admin Dashboard
      </Text>
      <Text className="text-lg text-gray-700 dark:text-gray-300">
        Chào mừng bạn đến trang chủ Admin!
      </Text>
    </View>
  );
};

export default AdminHomeScreen;
