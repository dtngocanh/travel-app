import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ActivityIndicator, 
  useWindowDimensions, 
  Platform 
} from "react-native";
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore"; 
import { Ionicons } from "@expo/vector-icons"; 
import { db } from "../../utils/firebase";
import { TourData, TourDetail } from "../../utils/types";
import { rankTours } from "../../utils/tourSuggest";
import { useBooking } from "../../src/contexts/BookingContext";
import { useAuth } from "../../src/contexts/AuthContex"; 
import { useRouter } from "expo-router";

type TourWithDetail = TourData & { id?: string | number; details?: TourDetail[] };

export default function SuggestTourScreen() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loading, setLoading] = useState(false);
  const [rankedTours, setRankedTours] = useState<TourWithDetail[]>([]);
  const [visibleTours, setVisibleTours] = useState<TourWithDetail[]>([]);
  const [index, setIndex] = useState(0);
  const [userPref, setUserPref] = useState({ maxPrice: 0, maxDays: 0, intensity: "low" as "low" | "high" });
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedTour } = useBooking();

  // --- Hệ thống Responsive & Web Layout ---
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const numColumns = width >= 1200 ? 4 : width >= 768 ? 2 : 1;
  const containerPadding = width > 1300 ? (width - 1300) / 2 : 20;

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
        await setDoc(favDocRef, { addedAt: new Date(), tourId: idStr });
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

  const fetchAndRecommend = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "tours"));
      const tours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TourWithDetail[];
      const ranked = rankTours(tours, userPref);
      setRankedTours(ranked);
      setVisibleTours(ranked.slice(0, 8)); // Hiện 8 card ban đầu trên Web
      setIndex(8);
      setStep(3);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const renderTourCard = ({ item }: { item: TourWithDetail }) => {
    const tourId = (item.id || item.id_tour || "").toString();
    const isFavorite = userFavorites.includes(tourId);

    return (
      <View 
        style={{
          flex: 1,
          margin: 10,
          backgroundColor: "white",
          borderRadius: 20,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#f3f4f6",
          ...Platform.select({
            web: { boxShadow: "0px 4px 15px rgba(0,0,0,0.06)" },
            default: { elevation: 3 }
          })
        }}
      >
        <View>
          <Image source={{ uri: item.image_tour }} className="w-full h-52" resizeMode="cover" />
          <TouchableOpacity
            onPress={() => toggleFavorite(tourId)}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full"
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "#ef4444" : "#1f2937"} />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.name_tour}</Text>
          <Text className="text-gray-500 text-sm mt-1">{item.location_tour} • {item.duration_tour}</Text>
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-amber-600 text-xl font-bold">${item.price_tour}</Text>
            <TouchableOpacity 
              className="bg-amber-500 py-2 px-5 rounded-lg" 
              onPress={() => {
                setSelectedTour(item);
                router.push("../screens/SelectDateScreen");
              }}
            >
              <Text className="text-white font-bold">Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Ẩn thanh cuộn trình duyệt trên Web */}
      {isWeb && (
        <style dangerouslySetInnerHTML={{ __html: `
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      )}

      {/* Header Bar */}
      <View style={{ paddingHorizontal: containerPadding }} className="pt-6 flex-row justify-between items-center">
        {step > 0 ? (
          <TouchableOpacity onPress={() => step === 3 ? resetQuiz() : setStep((prev) => (prev - 1) as any)}>
            <View className="flex-row items-center bg-gray-50 py-2 px-4 rounded-full">
              <Ionicons name="chevron-back" size={20} color="#1f2937" />
              <Text className="text-gray-900 font-semibold ml-1">{step === 3 ? "Restart" : "Back"}</Text>
            </View>
          </TouchableOpacity>
        ) : <View className="h-10" />}
      </View>

      <View className="flex-1" style={{ paddingHorizontal: containerPadding }}>
        {/* --- QUIZ SECTION (Giới hạn chiều rộng trên Web) --- */}
        {step < 3 && !loading && (
          <View className="mt-10 self-center w-full" style={{ maxWidth: 550 }}>
            <View className="mb-8 items-center">
              <Text className="text-amber-500 font-bold mb-2">TOUR RECOMMENDATION</Text>
              <Text className="text-4xl font-extrabold text-gray-900 text-center">Plan your next trip</Text>
              <View className="w-full h-1.5 bg-gray-100 rounded-full mt-8">
                <View className="h-full bg-amber-500 rounded-full" style={{ width: `${(step + 1) * 33}%` }} />
              </View>
              <Text className="text-gray-400 mt-3 text-xs font-bold tracking-widest uppercase">Step {step + 1} of 3</Text>
            </View>

            {step === 0 && (
              <View className="gap-y-3">
                <Text className="text-xl font-bold mb-4 text-gray-800 text-center">What is your maximum budget?</Text>
                {[800, 1200, 1500, 2000].map(p => (
                  <TouchableOpacity key={p} onPress={() => { setUserPref({ ...userPref, maxPrice: p }); setStep(1); }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm active:bg-amber-50">
                    <Text className="text-gray-800 font-bold text-lg text-center">Under ${p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {step === 1 && (
              <View className="gap-y-3">
                <Text className="text-xl font-bold mb-4 text-gray-800 text-center">How long is your ideal trip?</Text>
                {[5, 7, 10, 14].map(d => (
                  <TouchableOpacity key={d} onPress={() => { setUserPref({ ...userPref, maxDays: d }); setStep(2); }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm active:bg-amber-50">
                    <Text className="text-gray-800 font-bold text-lg text-center">Up to {d} days</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {step === 2 && (
              <View className="gap-y-4">
                <Text className="text-xl font-bold mb-4 text-gray-800 text-center">Choose your travel style</Text>
                <TouchableOpacity onPress={() => { setUserPref({ ...userPref, intensity: "low" }); fetchAndRecommend(); }}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm active:bg-amber-50 items-center">
                  <Ionicons name="cafe-outline" size={30} color="#f59e0b" />
                  <Text className="text-gray-800 font-bold text-xl mt-2">Relaxing & Leisure</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setUserPref({ ...userPref, intensity: "high" }); fetchAndRecommend(); }}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm active:bg-amber-50 items-center">
                  <Ionicons name="airplane-outline" size={30} color="#f59e0b" />
                  <Text className="text-gray-800 font-bold text-xl mt-2">Adventure & High Energy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text className="mt-4 text-gray-500 font-medium">Finding the perfect tours...</Text>
          </View>
        )}

        {/* --- RESULT SECTION (Grid đa cột, ẩn scrollbar) --- */}
        {step === 3 && (
          <View className="flex-1 mt-6">
            <View className="flex-row justify-between items-end mb-8">
              <View>
                <Text className="text-3xl font-extrabold text-gray-900">Your Recommendations</Text>
                <Text className="text-gray-500 mt-1">We found these tours based on your taste</Text>
              </View>
              <TouchableOpacity onPress={resetQuiz} className="bg-amber-50 px-4 py-2 rounded-lg">
                <Text className="text-amber-600 font-bold">Edit Plan</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              key={numColumns} // Force render lại grid khi resize màn hình
              data={visibleTours}
              numColumns={numColumns}
              keyExtractor={(item) => (item.id || item.id_tour || "").toString()}
              renderItem={renderTourCard}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 60 }}
              columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
              ListFooterComponent={index < rankedTours.length ? (
                <TouchableOpacity 
                  onPress={() => {
                    const next = rankedTours.slice(index, index + numColumns * 2);
                    setVisibleTours([...visibleTours, ...next]);
                    setIndex(index + numColumns * 2);
                  }} 
                  className="mx-2 border-2 border-dashed border-amber-200 p-6 rounded-2xl mt-6 items-center"
                >
                  <Text className="text-amber-600 font-bold">Load More Suggestions</Text>
                </TouchableOpacity>
              ) : (
                <View className="items-center mt-10">
                  <Text className="text-gray-400">You've seen all our top picks!</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}