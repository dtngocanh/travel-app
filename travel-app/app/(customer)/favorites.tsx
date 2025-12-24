import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Thêm cái này
import { db } from "../../utils/firebase";
import { useAuth } from "../../src/contexts/AuthContex";
import { collection, onSnapshot, doc, deleteDoc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const FavoritesScreen = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

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
              console.error("Error fetching tour", tourId, err);
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

  const removeFavorite = async (tourId: string) => {
    if (!user?.uid) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", tourId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="mt-2 text-gray-500">Loading your favorites...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]">
      {/* Header của trang Favorites */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">My Favorites</Text>
        <Text className="text-gray-500 text-sm">You have {favorites.length} saved destinations</Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Ionicons name="heart-dislike-outline" size={80} color="#d1d5db" />
          <Text className="text-gray-500 text-lg font-medium mt-4 text-center">
            No favorites yet. Start exploring and save your favorite tours!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          // Chỉnh Margin Top và Padding ở đây
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingTop: 16, // Khoảng cách so với tiêu đề
            paddingBottom: 40 
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View 
              style={{
                marginBottom: 20,
                backgroundColor: "white",
                borderRadius: 20,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <View>
                {item.image_tour ? (
                  <Image
                    source={{ uri: item.image_tour }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-48 bg-gray-200 items-center justify-center">
                    <Ionicons name="image-outline" size={40} color="#9ca3af" />
                  </View>
                )}
                
                {/* Nút Xóa nhanh ở góc ảnh */}
                <TouchableOpacity
                  onPress={() => removeFavorite(item.id)}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full"
                >
                  <Ionicons name="heart" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View className="p-4">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                      {item.name_tour || "No Name"}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location-outline" size={14} color="#6b7280" />
                      <Text className="text-gray-500 ml-1 text-sm">{item.location_tour || "Unknown"}</Text>
                    </View>
                  </View>
                  <Text className="text-amber-600 font-bold text-xl">${item.price_tour ?? "N/A"}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeFavorite(item.id)}
                  style={{
                    marginTop: 15,
                    borderWidth: 1,
                    borderColor: "#fee2e2",
                    backgroundColor: "#fef2f2",
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  <Text className="text-red-500 font-semibold ml-2">Remove from favorites</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;