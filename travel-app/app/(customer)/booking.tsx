import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from "react-native";
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore"; // Thêm các hàm firestore
import { Ionicons } from "@expo/vector-icons"; 
import { db } from "../../utils/firebase";
import { TourData, TourDetail } from "../../utils/types";
import { rankTours } from "../../utils/tourSuggest";
import { useBooking } from "../../src/contexts/BookingContext";
import { useAuth } from "../../src/contexts/AuthContex"; // Import Auth
import { useRouter } from "expo-router";

type TourWithDetail = TourData & { id?: string | number; details?: TourDetail[] };

export default function SuggestTourScreen() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loading, setLoading] = useState(false);
  const [rankedTours, setRankedTours] = useState<TourWithDetail[]>([]);
  const [visibleTours, setVisibleTours] = useState<TourWithDetail[]>([]);
  const [index, setIndex] = useState(0);
  const [userPref, setUserPref] = useState({ maxPrice: 0, maxDays: 0, intensity: "low" as "low" | "high" });
  
  // --- Bổ sung State cho Favorites ---
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useAuth(); // Lấy user hiện tại
  const { setSelectedTour } = useBooking();

  // --- Real-time lắng nghe danh sách yêu thích ---
  useEffect(() => {
    if (!user?.uid) return;

    const favCol = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favCol, (snapshot) => {
      const favIds = snapshot.docs.map((doc) => doc.id);
      setUserFavorites(favIds);
    });

    return () => unsubscribe();
  }, [user?.uid]);

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
        await setDoc(favDocRef, {
          addedAt: new Date(),
          tourId: idStr,
        });
      }
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setUserPref({ maxPrice: 0, maxDays: 0, intensity: "low" });
    setRankedTours([]);
    setVisibleTours([]);
  };

  const handleBookNow = (tour: TourWithDetail) => {
    setSelectedTour(tour);
    router.push("../screens/SelectDateScreen");
  };

  const fetchAndRecommend = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "tours"));
      const tours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TourWithDetail[];
      const ranked = rankTours(tours, userPref);
      setRankedTours(ranked);
      setVisibleTours(ranked.slice(0, 3));
      setIndex(3);
      setStep(3);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const renderTourCard = ({ item }: { item: TourWithDetail }) => {
    const tourId = (item.id || item.id_tour || "").toString();
    const isFavorite = userFavorites.includes(tourId);

    return (
      <View className="bg-white rounded-3xl overflow-hidden mb-5 shadow-sm border border-gray-100">
        <View>
          <Image source={{ uri: item.image_tour }} className="w-full h-48" />
          
          {/* Nút Trái tim (Favorite) */}
          <TouchableOpacity
            onPress={() => toggleFavorite(tourId)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: 8,
              borderRadius: 999,
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#ef4444" : "#1f2937"}
            />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900">{item.name_tour}</Text>
          <Text className="text-gray-500 my-1">{item.location_tour} • {item.duration_tour}</Text>
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-amber-600 text-xl font-bold">${item.price_tour}</Text>
            <TouchableOpacity className="bg-amber-500 py-2 px-5 rounded-xl" onPress={() => handleBookNow(item)}>
              <Text className="text-white font-semibold">Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Bar */}
      <View className="px-5 pt-12 flex-row justify-between items-center">
        {step > 0 ? (
          <TouchableOpacity onPress={() => step === 3 ? resetQuiz() : setStep((prev) => (prev - 1) as any)}>
            <View className="flex-row items-center">
              <Ionicons name="chevron-back" size={24} color="#1f2937" />
              <Text className="text-gray-900 font-medium ml-1">{step === 3 ? "Restart" : "Back"}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="h-8" />
        )}
      </View>

      <View className="flex-1 px-5 pt-6">
        {step < 3 && (
          <View className="mb-10">
            <Text className="text-amber-500 font-medium mb-1 text-base">Not sure which tour to choose? TripGo will help you.</Text>
            <Text className="text-4xl font-bold text-gray-900">Plan your trip</Text>
            <View className="flex-row items-center mt-2">
              <View className="h-1 bg-amber-500 rounded-full" style={{ width: `${(step + 1) * 33}%` }} />
              <Text className="text-gray-400 ml-3 text-sm font-semibold uppercase tracking-widest">Step {step + 1} of 3</Text>
            </View>
          </View>
        )}

        {/* --- Các Steps Quiz (Giữ nguyên logic của bạn) --- */}
        {step === 0 && (
          <View className="mt-4">
            <Text className="text-xl font-semibold mb-6 text-gray-800">What is your maximum budget?</Text>
            {[800, 1200, 1500, 2000].map(p => (
              <TouchableOpacity key={p} onPress={() => { setUserPref({ ...userPref, maxPrice: p }); setStep(1); }}
                className="bg-amber-50 p-6 rounded-2xl mb-4 border border-amber-100 active:bg-amber-100">
                <Text className="text-amber-900 font-bold text-lg">Under ${p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 1 && (
          <View className="mt-4">
            <Text className="text-xl font-semibold mb-6 text-gray-800">How long would you like to travel?</Text>
            {[5, 7, 10, 14].map(d => (
              <TouchableOpacity key={d} onPress={() => { setUserPref({ ...userPref, maxDays: d }); setStep(2); }}
                className="bg-amber-50 p-6 rounded-2xl mb-4 border border-amber-100 active:bg-amber-100">
                <Text className="text-amber-900 font-bold text-lg">Up to {d} days</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 2 && (
          <View className="mt-4">
            <Text className="text-xl font-semibold mb-6 text-gray-800">What is your travel style?</Text>
            <TouchableOpacity onPress={() => { setUserPref({ ...userPref, intensity: "low" }); fetchAndRecommend(); }}
              className="bg-amber-50 p-6 rounded-2xl mb-4 border border-amber-100 active:bg-amber-100">
              <Text className="text-amber-900 font-bold text-lg">Relaxing & Leisure</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setUserPref({ ...userPref, intensity: "high" }); fetchAndRecommend(); }}
              className="bg-amber-50 p-6 rounded-2xl mb-4 border border-amber-100 active:bg-amber-100">
              <Text className="text-amber-900 font-bold text-lg">Adventure & Challenge</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View className="mt-32 items-center">
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text className="mt-6 text-gray-500 text-base">Analyzing best tours for you...</Text>
          </View>
        )}

        {step === 3 && (
          <View className="flex-1">
            <View className="flex-row justify-between items-end mb-6">
              <Text className="text-2xl font-bold text-gray-900">Recommended for you</Text>
              <TouchableOpacity onPress={resetQuiz}>
                <Text className="text-amber-600 font-bold mb-1">Edit Plan</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={visibleTours}
              keyExtractor={(item) => (item.id || item.id_tour || "").toString()}
              renderItem={renderTourCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListFooterComponent={index < rankedTours.length ? (
                <TouchableOpacity onPress={() => {
                  const next = rankedTours.slice(index, index + 3);
                  setVisibleTours([...visibleTours, ...next]);
                  setIndex(index + 3);
                }} className="border border-dashed border-amber-400 p-5 rounded-2xl mt-2 mb-10">
                  <Text className="text-amber-600 text-center font-bold">Show more suggestions</Text>
                </TouchableOpacity>
              ) : null}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}