import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAllTours } from "../../utils/api";
import { useRouter } from "expo-router";
import { useBooking } from "../../src/contexts/BookingContext";
import { useAuth } from "../../src/contexts/AuthContex";
import { useNotification } from "../../src/contexts/NotificationContext";

const ToursScreen = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setSelectedTour } = useBooking();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const numColumns = isDesktop ? 4 : isTablet ? 2 : 1;
  const cardSpacing = 16;
  const horizontalPadding = 16;
  const cardWidth = numColumns > 1
    ? (width - horizontalPadding * 2 - cardSpacing * (numColumns - 1)) / numColumns
    : (width - horizontalPadding * 2 - cardSpacing);


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
  const handleBookNow = (tour) => {
    setSelectedTour(tour);
    router.push("../screens/SelectDateScreen");
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

  const trendingTours = tours.slice(0, 3);

  const { notifications } = useNotification();

  const unreadCount = notifications.filter(n => !n.read).length;



  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-amber-700 text-2xl font-semibold">Welcome, {user?.firstName || "Guest"}</Text>
          {/* <Text className="text-xl font-bold">Where to next?</Text> */}
        </View>

        <TouchableOpacity className="p-2 bg-white rounded-full shadow">
          <Ionicons name="notifications-outline" size={22} color="#f59e0b" onPress={() => router.push("../screens/NotificationsScreen")} />
          {unreadCount > 0 && (
            <View className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">{unreadCount}</Text>
            </View>
          )}
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

      {loading ? (
        <Text className="text-center text-gray-500 mt-6">Loading...</Text>
      ) : (
        <FlatList
          data={filteredTours}
          keyExtractor={(item) => item.id || item.id_tour}
          numColumns={numColumns}
          contentContainerStyle={{
            paddingBottom: 80,
            paddingHorizontal: horizontalPadding,
          }}
          columnWrapperStyle={
            numColumns > 1
              ? { justifyContent: "space-between", marginBottom: cardSpacing }
              : undefined
          }
          renderItem={({ item }) => {
            const rating = Number(item.reviews_tour) || 0;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: cardWidth,
                  marginBottom: cardSpacing,
                  marginHorizontal: numColumns > 1 ? cardSpacing / 2 : 0,
                  backgroundColor: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: item.image_tour }}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    padding: 8,
                    borderRadius: 999,
                  }}
                >
                  <Ionicons name="heart-outline" size={20} color="#f59e0b" />
                </TouchableOpacity>
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>{item.name_tour}</Text>
                  <Text style={{ color: "#6b7280", marginTop: 4 }}>{item.location_tour} • {item.duration_tour}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                    {renderStars(rating)}
                    <Text style={{ color: "#4b5563", fontSize: 12, marginLeft: 4 }}>{rating.toFixed(1)}</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <Text style={{ color: "#d97706", fontWeight: "600", fontSize: 16 }}>${item.price_tour}</Text>
                    <TouchableOpacity
                      style={{ backgroundColor: "#f59e0b", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999 }}
                      onPress={() => handleBookNow(item)}
                    >
                      <Text style={{ color: "#fff", fontWeight: "500" }}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

      )}
    </SafeAreaView>
  );
};

export default ToursScreen;

