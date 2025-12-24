import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  ListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Firebase & Utils
import { db } from "../../utils/firebase";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { getAllTours } from "../../utils/api";

// Contexts
import { useBooking } from "../../src/contexts/BookingContext";
import { useAuth } from "../../src/contexts/AuthContex";
import { useNotification } from "../../src/contexts/NotificationContext";

// --- Định nghĩa Interfaces ---
interface Tour {
  id?: string;
  id_tour: string | number;
  name_tour: string;
  image_tour: string;
  location_tour: string;
  duration_tour: string;
  price_tour: number;
  reviews_tour: string | number;
}

const ToursScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setSelectedTour } = useBooking();
  const { notifications } = useNotification();

  // --- State ---
  const [query, setQuery] = useState<string>("");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  // --- Tính toán Layout Responsive ---
  const { width } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const numColumns = isDesktop ? 4 : isTablet ? 2 : 1;
  const cardSpacing = 16;
  const horizontalPadding = 16;

  const cardWidth = numColumns > 1
    ? (width - horizontalPadding * 2 - cardSpacing * (numColumns - 1)) / numColumns
    : (width - horizontalPadding * 2);

  // --- Effects ---
  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const favCol = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favCol, (snapshot) => {
      const favIds = snapshot.docs.map((doc) => doc.id);
      setUserFavorites(favIds);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const fetchTours = async () => {
    try {
      const res = await getAllTours();
      setTours(res.data);
    } catch (error) {
      console.error("Lỗi fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (tour: Tour) => {
    setSelectedTour(tour);
    router.push("../screens/SelectDateScreen");
  };

  const toggleFavorite = async (tourId: string | number) => {
    if (!user?.uid) {
      alert("Please login to add favorites!");
      return;
    }
    const idStr = tourId.toString();
    const favDocRef = doc(db, "users", user.uid, "favorites", idStr);
    try {
      if (userFavorites.includes(idStr)) {
        await deleteDoc(favDocRef);
      } else {
        await setDoc(favDocRef, { addedAt: new Date(), tourId: idStr });
      }
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={14} color="#f59e0b" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#f59e0b" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#f59e0b" />);
    }
    return <View className="flex-row items-center mt-1">{stars}</View>;
  };

  const filteredTours = query.trim() === ""
    ? tours
    : tours.filter((tour) => tour.name_tour?.toLowerCase().includes(query.toLowerCase()));

  const trendingTours = tours.slice(0, 5); // Lấy top 5 cho trending
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- Render Item cho Danh sách chính ---
  const renderTourItem = ({ item }: ListRenderItemInfo<Tour>) => {
    const tourId = (item.id || item.id_tour).toString();
    const isFavorite = userFavorites.includes(tourId);
    const rating = Number(item.reviews_tour) || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          width: cardWidth,
          marginBottom: cardSpacing,
          backgroundColor: "white",
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#f3f4f6",
        }}
      >
        <Image source={{ uri: item.image_tour }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
        
        <TouchableOpacity
          onPress={() => toggleFavorite(tourId)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "white",
            padding: 6,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            elevation: 3,
          }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#ef4444" : "#9ca3af"}
          />
        </TouchableOpacity>

        <View style={{ padding: 12 }}>
          <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>{item.name_tour}</Text>
          <Text style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{item.location_tour}</Text>
          
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            {renderStars(rating)}
            <Text style={{ color: "#4b5563", fontSize: 12, marginLeft: 6 }}>({rating})</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <View>
              <Text style={{ color: "#9ca3af", fontSize: 10 }}>Price</Text>
              <Text style={{ color: "#f59e0b", fontWeight: "700", fontSize: 18 }}>${item.price_tour}</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: "#f59e0b", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 }}
              onPress={() => handleBookNow(item)}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // --- Render Header (Đây là phần sẽ cuộn theo trang) ---
  const renderHeader = () => (
    <View style={{ paddingTop: 10 }}>
      {/* Header Profile & Noti */}
      <View style={{ paddingHorizontal: horizontalPadding }} className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-gray-500 text-sm">Welcome back,</Text>
          <Text className="text-amber-800 text-2xl font-bold">{user?.firstName || "Guest"}</Text>
        </View>
        <TouchableOpacity 
          className="p-2 bg-white rounded-full border border-gray-100 shadow-sm" 
          onPress={() => router.push("../screens/NotificationsScreen")}
        >
          <Ionicons name="notifications-outline" size={24} color="#f59e0b" />
          {unreadCount > 0 && (
            <View className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: horizontalPadding }} className="mb-6">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search your next destination..."
            placeholderTextColor="#9ca3af"
            className="ml-3 flex-1 text-gray-700 font-medium"
            onChangeText={setQuery}
            value={query}
          />
        </View>
      </View>

      {/* Trending Destinations */}
      <View className="mb-6">
        <View style={{ paddingHorizontal: horizontalPadding }} className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Trending Now</Text>
          <TouchableOpacity><Text className="text-amber-500 font-semibold">See all</Text></TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trendingTours}
          keyExtractor={(item) => `trending-${item.id || item.id_tour}`}
          contentContainerStyle={{ paddingLeft: horizontalPadding }}
          renderItem={({ item }) => (
            <TouchableOpacity className="mr-4 rounded-3xl overflow-hidden shadow-sm bg-white">
              <Image source={{ uri: item.image_tour }} style={{ width: 150, height: 180 }} resizeMode="cover" />
              <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/30">
                <Text numberOfLines={1} className="text-white font-bold">{item.name_tour}</Text>
                <Text className="text-white/80 text-xs">{item.location_tour}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Section Title cho Popular */}
      <View style={{ paddingHorizontal: horizontalPadding }} className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Popular Destinations</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#f59e0b" size="large" />
          <Text className="text-gray-400 mt-3 font-medium">Discovering tours...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTours}
          keyExtractor={(item) => (item.id || item.id_tour).toString()}
          numColumns={numColumns}
          key={numColumns} 
          
          // Gắn Header vào đây
          ListHeaderComponent={renderHeader}
          renderItem={renderTourItem}
          
          // Style cho danh sách
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: horizontalPadding,
          }}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  justifyContent: "space-between",
                  gap: cardSpacing,
                }
              : undefined
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ToursScreen;