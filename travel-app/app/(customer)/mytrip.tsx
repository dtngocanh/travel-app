import React, { useEffect, useState } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "expo-router";
import TabButon, { TabbutonType } from "../(mytrip)/Tabbutton";
import TripCard from "../(mytrip)/Element";

export enum Triptabs {
  UPCOMING,
  COMPLETE,
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

  const filtered = booking
    .filter((item) =>
      selecttab === Triptabs.COMPLETE ? item.status === "paid" : item.status === "complete"
    )
    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-5 px-4">
      <TabButon
        button={buttons}
        selecttab={selecttab}
        setSelecttab={setSelecttab}
      />

      <View className="py-4">
        <Text className="text-xl font-bold text-gray-800">
          {selecttab === Triptabs.UPCOMING ? "Upcoming Trips" : "Completed Trips"}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleTourPress(item)}
            // Sử dụng activeOpacity cơ bản, không dùng scale hay transition
            activeOpacity={0.7} 
            className="bg-white rounded-2xl"
          >
            <TripCard
              dates={item.createdAt?.toLocaleDateString ? item.createdAt.toLocaleDateString("en-US") : "N/A"}
              nametour={item.tourData?.name_tour || "Unknown Tour"}
              imagetour={item.tourData?.image_tour || ""} 
              duration={item.tourData?.duration_tour || "N/A"}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="mt-20 items-center">
            <Text className="text-gray-400">No trips found.</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Tabscreen;