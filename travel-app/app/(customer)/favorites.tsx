import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../utils/firebase";
import { useAuth } from "../../src/contexts/AuthContex";
import { collection, onSnapshot, doc, deleteDoc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 1. Import useRouter

const FavoritesScreen = () => {
  const { user } = useAuth();
  const router = useRouter(); // 2. Khởi tạo router
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const horizontalPadding = width > 1200 ? (width - 1200) / 2 : 20; 
  const gap = 20;

  useEffect(() => {
    if (!user?.uid) return;

    const favCol = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favCol, async (snapshot) => {
      const tourIds = snapshot.docs.map((doc) => doc.id);

      if (tourIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const favTours = await Promise.all(
          tourIds.map(async (tourId) => {
            try {
              const tourDoc = await getDoc(doc(db, "tours", tourId));
              if (!tourDoc.exists()) return null;
              return { id: tourId, ...tourDoc.data() };
            } catch (err) {
              return null;
            }
          })
        );
        setFavorites(favTours.filter(Boolean));
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Logic điều hướng xem chi tiết
  const handleTourPress = (tour: any) => {
    const tourId = tour.id || tour.id_tour;
    router.push(`/(detail)/tourdetail?id=${tourId}`);
  };

  const removeFavorite = async (tourId: string) => {
    if (!user?.uid) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", tourId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      // 4. Bọc toàn bộ Card bằng TouchableOpacity để nhấn xem chi tiết
      onPress={() => handleTourPress(item)}
      activeOpacity={0.9}
      style={{
        flex: 1,
        margin: gap / 2,
        backgroundColor: "white",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#f3f4f6",
        ...Platform.select({
          web: { boxShadow: "0px 4px 12px rgba(0,0,0,0.08)" },
          default: { elevation: 4 }
        })
      }}
    >
      <View>
        {item.image_tour ? (
          <Image source={{ uri: item.image_tour }} className="w-full h-56" resizeMode="cover" />
        ) : (
          <View className="w-full h-56 bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={40} color="#9ca3af" />
          </View>
        )}
        
        {/* Nút Tim - Nhấn để bỏ thích */}
        <TouchableOpacity
          onPress={() => removeFavorite(item.id)}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm"
          style={{ zIndex: 10 }} // Đảm bảo nút tim luôn nằm trên cùng để nhận click
        >
          <Ionicons name="heart" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
              {item.name_tour || "No Name"}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text className="text-gray-500 ml-1 text-sm">{item.location_tour || "Unknown"}</Text>
            </View>
          </View>
          <Text className="text-amber-600 font-bold text-xl ml-2">${item.price_tour}</Text>
        </View>

        {/* Nút Remove ở dưới - Vẫn giữ chức năng xóa */}
        <TouchableOpacity
          onPress={() => removeFavorite(item.id)}
          activeOpacity={0.7}
          className="mt-4 border border-red-100 bg-red-50 py-3 rounded-xl flex-row justify-center items-center"
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
          <Text className="text-red-500 font-semibold ml-2">Remove from Favorites</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8f9fa]">
      <View style={{ paddingHorizontal: horizontalPadding }} className="pt-6 pb-4">
        <Text className="text-3xl font-extrabold text-gray-900">My Favorites</Text>
        <Text className="text-gray-500 text-base mt-1">
          You have saved {favorites.length} destinations to your wishlist.
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Ionicons name="heart-dislike-outline" size={100} color="#e5e7eb" />
          <Text className="text-gray-400 text-xl font-medium mt-4 text-center">
            Your wishlist is empty.
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/")}
            className="mt-6 bg-amber-500 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-bold">Explore Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={favorites}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={{ 
            paddingHorizontal: horizontalPadding - (gap / 2), 
            paddingBottom: 40 
          }}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;