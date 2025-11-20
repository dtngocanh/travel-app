import React from "react";
import { View, Text, Modal, Pressable, Image, ScrollView, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface User {
  uid: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar?: string;
  createdAt?: { _seconds: number };
}

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const formatDate = (sec?: number) => {
  if (!sec) return "No data";
  return new Date(sec * 1000).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  const { height } = useWindowDimensions();
  const maxModalHeight = height * 0.85; // tối đa 85% chiều cao màn hình

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-5 backdrop-blur-sm">

        <View
          style={{ maxHeight: maxModalHeight }}
          className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100"
        >
          {/* ScrollView cho nội dung */}
          <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Title */}
            <Text className="text-2xl font-bold text-center text-gray-900 mb-6">
              User Information
            </Text>

            {/* Avatar */}
            <View className="items-center mb-6">
              <Image
                source={{ uri: user?.avatar || "https://i.pravatar.cc/200" }}
                className="w-28 h-28 rounded-full shadow-md border-4 border-white"
              />
            </View>

            {/* Info Table */}
            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-5">
              <DetailItem icon="mail-outline" label="Email" value={user?.email} />
              <DetailItem
                icon="person-outline"
                label="Full Name"
                value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
              />
              <DetailItem icon="call-outline" label="Phone" value={user?.phone} />
              <DetailItem
                icon="briefcase-outline"
                label="Role"
                value={user?.role?.toUpperCase()}
              />
              <DetailItem icon="location-outline" label="City" value={user?.city} />
              <DetailItem icon="flag-outline" label="Country" value={user?.country} />
              <DetailItem
                icon="calendar-outline"
                label="Joined"
                value={formatDate(user?.createdAt?._seconds)}
              />
            </View>
          </ScrollView>

          {/* Close Button */}
          <Pressable
            onPress={onClose}
            className="mt-4 py-3 rounded-xl bg-gray-200 active:scale-95 shadow-sm"
          >
            <Text className="text-center text-gray-700 font-semibold text-lg">
              Close
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );

  function DetailItem({
    label,
    value,
    icon,
  }: {
    label: string;
    value?: string | null;
    icon: keyof typeof Ionicons.glyphMap;
  }) {
    return (
      <View className="flex-row items-start pb-4 border-b border-gray-200 last:border-b-0">
        {/* Icon */}
        <Ionicons
          name={icon}
          size={22}
          color="#4B5563"
          style={{ marginTop: 2, width: 26 }}
        />
        {/* Label + Value */}
        <View className="flex-1 ml-2">
          <Text className="text-gray-500 text-sm mb-0.5">{label}</Text>
          <Text className="text-gray-900 font-semibold text-base leading-tight">
            {value || "No data"}
          </Text>
        </View>
      </View>
    );
  }
};

export default UserDetailModal;
