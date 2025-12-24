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
  const horizontalPadding = 16; // Padding lề trái phải

  // Tính toán cardWidth chuẩn để lấp đầy không gian đã trừ đi padding lề và khoảng cách giữa các card
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
      stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#f59e0b" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#f59e0b" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#f59e0b" />);
    }
    return <View className="flex-row items-center mt-1">{stars}</View>;
  };

  const filteredTours = query.trim() === ""
    ? tours
    : tours.filter((tour) => tour.name_tour?.toLowerCase().includes(query.toLowerCase()));

  const trendingTours = tours.slice(0, 3);
  const unreadCount = notifications.filter(n => !n.read).length;

  const renderTourItem = ({ item }: ListRenderItemInfo<Tour>) => {
    const tourId = (item.id || item.id_tour).toString();
    const isFavorite = userFavorites.includes(tourId);
    const rating = Number(item.reviews_tour) || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: cardWidth,
          marginBottom: cardSpacing,
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
        <Image source={{ uri: item.image_tour }} style={{ width: "100%", height: 180 }} resizeMode="cover" />

        <TouchableOpacity
          onPress={() => toggleFavorite(tourId)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: 8,
            borderRadius: 999,
          }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#ef4444" : "#f59e0b"}
          />
        </TouchableOpacity>

        <View style={{ padding: 16 }}>
          <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>{item.name_tour}</Text>
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
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      {/* Header & Search (Giữ padding để không sát mép màn hình) */}
      <View style={{ paddingHorizontal: horizontalPadding }}>
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-amber-700 text-2xl font-semibold">Welcome, {user?.firstName || "Guest"}</Text>
          </View>
          <TouchableOpacity className="p-2 bg-white rounded-full shadow" onPress={() => router.push("../screens/NotificationsScreen")}>
            <Ionicons name="notifications-outline" size={22} color="#f59e0b" />
            {unreadCount > 0 && (
              <View className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">Trending Destinations</Text>
          <TouchableOpacity><Text className="text-amber-500 font-medium">View All</Text></TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 170, paddingLeft: horizontalPadding }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trendingTours}
          keyExtractor={(item) => (item.id || item.id_tour).toString()}
          renderItem={({ item }) => (
            <TouchableOpacity className="mr-4 rounded-2xl overflow-hidden w-40">
              <Image source={{ uri: item.image_tour }} className="w-40 h-40" resizeMode="cover" />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ paddingHorizontal: horizontalPadding, marginTop: 10, marginBottom: 10 }}>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold">Popular Destinations</Text>
          <TouchableOpacity><Text className="text-amber-500 font-medium">View All</Text></TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#f59e0b" size="large" />
          <Text className="text-gray-500 mt-2">Loading tours...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTours}
          keyExtractor={(item) => (item.id || item.id_tour).toString()}
          numColumns={numColumns}
          key={numColumns} // Cực kỳ quan trọng khi đổi số cột
          contentContainerStyle={{
            paddingBottom: 80,
            paddingHorizontal: horizontalPadding, // Căn lề hai bên cho container
            alignItems: numColumns === 1 ? "center" : "stretch", // Căn giữa nếu chỉ có 1 cột
          }}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  justifyContent: "center", // Căn giữa các card trong hàng
                  gap: cardSpacing, // Khoảng cách giữa các card (Modern style)
                }
              : undefined
          }
          renderItem={renderTourItem}
        />
      )}
    </SafeAreaView>
  );
};

export default ToursScreen;