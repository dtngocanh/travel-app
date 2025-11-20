import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAllTours } from "../../utils/api";

const ToursScreen = () => {
  const [query, setQuery] = useState("");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await getAllTours();
      setTours(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Lỗi fetch tours:", error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={16} color="#f59e0b" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#f59e0b" />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#f59e0b"
        />
      );
    }
    return <View className="flex-row items-center mt-1">{stars}</View>;
  };

  const filteredTours =
    query.trim() === ""
      ? tours
      : tours.filter((tour) =>
        tour.name_tour?.toLowerCase().includes(query.toLowerCase())
      );

  // Trending destinations (lấy top 3 tour)
  const trendingTours = tours.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-gray-500 text-base">Hey Shanto,</Text>
          <Text className="text-2xl font-bold">Where to next?</Text>
        </View>

        <TouchableOpacity className="p-2 bg-white rounded-full shadow">
          <Ionicons name="notifications-outline" size={22} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-4">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder="Search worldwide"
          placeholderTextColor="#9ca3af"
          className="ml-3 flex-1 text-gray-700"
          onChangeText={setQuery}
          value={query}
        />
      </View>

      {/* Trending Destinations */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">Trending Destinations</Text>
        <TouchableOpacity>
          <Text className="text-amber-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={trendingTours}
        keyExtractor={(item) => item.id || item.id_tour}
        className="mb-6"
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4 rounded-2xl overflow-hidden w-40">
            <Image
              source={{ uri: item.image_tour }}
              className="w-40 h-40"
              resizeMode="cover"
            />
            {/* <View className="absolute bottom-2 left-2 bg-white/70 px-2 py-1 rounded">
              <Text className="font-semibold">{item.name_tour}</Text>
            </View> */}
          </TouchableOpacity>
        )}
      />

      {/* Popular Destinations */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">Popular Destinations</Text>
        <TouchableOpacity>
          <Text className="text-amber-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {loading ? (
          <Text className="text-center text-gray-500 mt-6">Loading...</Text>
        ) : (
          filteredTours.map((tour) => (
            <TouchableOpacity
              key={tour.id || tour.id_tour}
              activeOpacity={0.8}
              className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden"
            >
              <Image
                source={{ uri: tour.image_tour }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <TouchableOpacity className="absolute top-3 right-3 bg-white/80 p-2 rounded-full">
                <Ionicons name="heart-outline" size={20} color="#f59e0b" />
              </TouchableOpacity>
              <View className="p-4">
                <Text className="text-lg font-semibold text-gray-900">
                  {tour.name_tour}
                </Text>
                <Text className="text-gray-500 mt-1">
                  {tour.location_tour} • {tour.duration_tour}
                </Text>

                <View className="flex-row items-center mt-2">
                  {renderStars(tour.reviews_tour || 0)}
                  <Text className="text-gray-600 text-sm ml-2">
                    {tour.reviews_tour?.toFixed(1) || "0.0"}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-3">
                  <Text className="text-amber-600 font-semibold text-base">
                    ${tour.price_tour}
                  </Text>
                  <TouchableOpacity className="bg-amber-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-medium">Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToursScreen;

