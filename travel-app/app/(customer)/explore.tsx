import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAllTours } from "../../src/services/toursService.js";

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
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#f59e0b" />
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

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">

      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-4">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder="Search your adventure..."
          placeholderTextColor="#9ca3af"
          className="ml-3 flex-1 text-gray-700"
          onChangeText={setQuery}
          value={query}
        />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around mb-4">
        <TouchableOpacity className="border border-amber-400 rounded-full px-4 py-2 bg-amber-50">
          <Text className="text-amber-500 font-medium">Popular Destination</Text>
        </TouchableOpacity>
        <TouchableOpacity className="border border-gray-300 rounded-full px-4 py-2">
          <Text className="text-gray-500 font-medium">Create your own</Text>
        </TouchableOpacity>
      </View>

      {/* Tours List */}
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
                  {tour.duration_tour} • {tour.location_tour}
                </Text>

                {/* Hiển thị sao đánh giá */}
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
