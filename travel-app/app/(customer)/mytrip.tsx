import React, { useEffect, useState } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "expo-router";
import TabButon, { TabbutonType } from "../(mytrip)/Tabbutton";
import TripCard from "../(mytrip)/Element";

export enum Triptabs {
  UPCOMING = 0,
  COMPLETE = 1,
}

const Tabscreen = () => {
  const router = useRouter();
  const [booking, setBooking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecttab, setSelecttab] = useState<Triptabs>(Triptabs.UPCOMING);

  const buttons: TabbutonType[] = [
    { title: "Upcoming" },
    { title: "Complete" },
  ];

  const handleTourPress = (item: any) => {
    const tourId = item.tourId || item.tourData?.id || item.tourData?.id_tour;
    if (tourId) {
      router.push(`/(detail)/tourdetail?id=${tourId}`);
    }
  };

  const convertTimestamp = (obj: any) => {
    const result: any = {};
    Object.keys(obj).forEach(key => {
      result[key] = obj[key]?.toDate ? obj[key].toDate() : obj[key];
    });
    return result;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setBooking([]);
        setLoading(false);
        return;
      }
      const q = query(collection(db, "bookings"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const res = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamp(doc.data()),
      }));
      setBooking(res);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- LOGIC FILTER ĐÃ SỬA THEO Ý BẠN ---
  const filtered = booking
    .filter((item) => {
      if (selecttab === Triptabs.COMPLETE) {
        // Tab Complete: Bây giờ sẽ hiện các tour có status là "paid"
        return item.status === "paid";
      } else {
        // Tab Upcoming: Hiện các tour có status khác "paid" (ví dụ "complete", "pending"...)
        return item.status !== "paid";
      }
    })
    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* pt-16 đẩy tab xuống thấp để máy ảo dễ tương tác */}
      <View className="flex-1 px-4 pt-16">
        
        <View style={{ zIndex: 999, elevation: 5 }} className="mb-4">
          <TabButon
            button={buttons}
            selecttab={selecttab}
            setSelecttab={(index: number) => setSelecttab(index)}
          />
        </View>

        <View className="py-2">
          <Text className="text-2xl font-bold text-gray-800">
            {selecttab === Triptabs.UPCOMING ? "Upcoming Trips" : "Completed Trips"}
          </Text>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-4" />}
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleTourPress(item)}
              activeOpacity={0.8} 
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
              style={{ elevation: 2 }}
            >
              <TripCard
                dates={item.createdAt?.toLocaleDateString ? item.createdAt.toLocaleDateString("vi-VN") : "N/A"}
                nametour={item.tourData?.name_tour || "Unknown Tour"}
                imagetour={item.tourData?.image_tour || ""} 
                duration={item.tourData?.duration_tour || "N/A"}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 mt-20 items-center justify-center">
              <Text className="text-gray-400 text-lg">Không có dữ liệu phù hợp.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Tabscreen;