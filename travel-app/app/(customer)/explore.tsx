import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TourCard from "../../src/components/TourCard";

const sampleImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1601758123927-196ed0f92f5f",
];

const ToursScreen: FC = () => {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {/* Thanh tìm kiếm */}
      <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mt-4">
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder="Find Your Adventure"
          className="flex-1 ml-2 text-gray-700"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around mt-4">
        <TouchableOpacity className="border border-amber-400 rounded-full px-4 py-2 bg-amber-50">
          <Text className="text-amber-500 font-medium">Popular Destination</Text>
        </TouchableOpacity>
        <TouchableOpacity className="border border-gray-300 rounded-full px-4 py-2">
          <Text className="text-gray-500 font-medium">Create your own</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách tour */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-5"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <TourCard
          title="Delhi-UP Tour"
          price={40.7}
          duration="2 days tour"
          reviews={200}
          rating={5}
          imageUrls={sampleImages}
        />

        <TourCard
          title="Kerala Backwaters"
          price={40.7}
          duration="2 days tour"
          reviews={180}
          rating={4.5}
          imageUrls={sampleImages}
        />
      </ScrollView>

      {/* Thanh điều hướng dưới */}
      {/* <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row justify-between items-center px-6 py-3">
          <Ionicons name="home-outline" size={24} color="gray" />
          <Ionicons name="notifications-outline" size={24} color="gray" />
          <Ionicons name="briefcase-outline" size={24} color="gray" />
          <Ionicons name="compass" size={26} color="#F59E0B" />
          <Ionicons name="person-outline" size={24} color="gray" />
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default ToursScreen;
