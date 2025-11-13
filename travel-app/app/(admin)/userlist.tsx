import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { getUserList } from "../../utils/api_admin";

// Avatar mặc định
const DEFAULT_AVATAR = "https://i.pravatar.cc/100?img=68";

interface User {
  uid: string;
  email: string;
  role: string;
}

const GetUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gọi API admin, token sẽ auto refresh trong api_admin
        const res = await getUserList();
        setUsers(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Lỗi khi lấy danh sách user");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View className="flex-row items-center bg-white p-4 rounded-lg shadow mb-2">
      <Image source={{ uri: DEFAULT_AVATAR }} className="w-12 h-12 rounded-full mr-4" />
      <View className="flex-1">
        <Text className="text-base font-bold text-black">{item.email}</Text>
        <Text className={`text-sm ${item.role === "admin" ? "text-red-500" : "text-gray-600"}`}>
          {item.role.toUpperCase()}
        </Text>
        <Text className="text-xs text-gray-400">{item.uid}</Text>
      </View>
    </View>
  );

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-black mb-4">Danh sách Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default GetUserList;
