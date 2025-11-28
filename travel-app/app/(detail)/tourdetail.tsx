import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getTourById, getTripDetailsByTourId } from "../../utils/api"; 

import ExpandableItem from './tripdetail';
import Specifications from './Info_tour';
import CalendarPopup from './calendarpopup';

interface TourDetails {
  id: string;
  name_tour: string;
  location_tour: string;
  duration_tour: string;
  image_tour: string;
  price_tour: number;
  reviews_tour?: number;
}

interface TripDetails {
  id_trip: string;
  itinerary_day: string;
  intensity_desc: string;
  itinerary_image: string;
  age_range: string;
  group_size: string;
  itinerary_accommodation: string;
  itinerary_desc: string;
  language: string;
  operator_name: string;
  tour_style_desc: string;
}

export default function TourDetailPage() {
  const { id } = useLocalSearchParams(); 

  const [tourDetails, setTourDetails] = useState<TourDetails | null>(null);
  const [tripItineraries, setTripItineraries] = useState<TripDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const isWeb = Platform.OS === "web";
  const firstTripItem = tripItineraries[0];

  const fetchTourDetails = async (tourId: string | string[]) => {
    try {
      const res = await getTourById(tourId as string);
      setTourDetails(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (tourId: string) => {
    const res = await getTripDetailsByTourId(tourId);
    setTripItineraries(res.data);
  };
  const handleBooking = () => {
    if (isWeb) {
      const selected = prompt("Chọn ngày bắt đầu tour (YYYY-MM-DD):");
      if (selected) { alert(`Bạn đã chọn: ${selected}`); router.push(`/booking?date=${selected}`); }
    } else {
      setShowCalendar(true);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([
        fetchTourDetails(id),
        fetchTripDetails(id as string)
      ]);
    }
  }, [id]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#f59e0b"/></View>;
  if (!tourDetails) return <View style={styles.center}><Text>Lỗi tải dữ liệu.</Text></View>;

  const tour = tourDetails;

  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fafafa", alignItems: "center" }}>
        <Stack.Screen options={{ headerTitle: tour.name_tour }} />

        <View style={{ width: 1200, padding: 20 }}>
          <View style={{ flexDirection: "row", gap: 20 }}>

            {/* Left column */}
            <View style={{ flex: 2 }}>
              <Image
                source={{ uri: tour.image_tour }}
                style={{ width: "100%", height: 450, borderRadius: 16 }}
              />

              <div style={{ marginTop: 20 }}>
                <Specifications content={firstTripItem} />
              </div>

              <View style={{ backgroundColor: "white", padding: 20, borderRadius: 16, marginTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Itinerary</Text>
                {tripItineraries.map((item) => (
                  <ExpandableItem
                    key={item.id_trip}
                    title={item.itinerary_day}
                    content={<Text>{item.itinerary_desc}</Text>}
                    image_url={item.itinerary_image}
                  />
                ))}
              </View>
            </View>

            {/* Right column */}
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: "white", padding: 20, borderRadius: 16 }}>
                <Text style={{ fontSize: 28, fontWeight: "bold" }}>{tour.name_tour}</Text>

                <Text style={{ fontSize: 20, color: "#f59e0b", marginVertical: 10 }}>
                  ${tour.price_tour}
                </Text>

                <TouchableOpacity
                  onPress={handleBooking}
                  style={{
                    padding: 14,
                    backgroundColor: "#f59e0b",
                    borderRadius: 10,
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{         headerTitle: '',

          headerRight: () => (

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              {/* Icon 1: Search */}

              <TouchableOpacity style={{ marginRight: 20 }}>

                <Ionicons name="share-social-outline" size={24} color="#333" />

              </TouchableOpacity>

             

              <TouchableOpacity>

               

                <Ionicons

                  name="heart-outline"

                  size={24}

                  color="#FF6347"

                />

              </TouchableOpacity>

            </View>

          ),

   

          // headerLeft: () => (

          //   <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: -5 }}>

          //     <Ionicons name="chevron-back" size={30} color="#333" />

          //   </TouchableOpacity>

          // ),



          // Tùy chọn để làm Header trong suốt (để ảnh phía dưới nhìn xuyên qua)

          // headerTransparent: true,

        }}

        />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: tour.image_tour }} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.title}>{tour.name_tour}</Text>
          <Text style={{ color: "#f59e0b", fontSize: 20, fontWeight: "bold" }}>${tour.price_tour}</Text>
        </View>

        {firstTripItem && <Specifications content={firstTripItem} />}

        <View style={styles.mobileBox}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Itinerary</Text>
          {tripItineraries.map((item, index) => (
            <ExpandableItem
              key={index}
              title={item.itinerary_day}
              content={<Text>{item.itinerary_desc}</Text>}
              image_url={item.itinerary_image}
            />
          ))}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer}>
        <TouchableOpacity onPress={handleBooking} style={styles.button}>
          <Text style={{ color: "white", fontSize: 16 }}>Book Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {showCalendar && (
        <CalendarPopup
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </View>
  );
}

// ----------------------
// 📌 STYLES
// ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 300 },
  card: { padding: 20, backgroundColor: "white", marginTop: -30, borderRadius: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  mobileBox: { backgroundColor: "white", padding: 20, borderRadius: 20, marginTop: 20 },
  footer: { padding: 15, backgroundColor: "white" },
  button: { backgroundColor: "#f59e0b", padding: 15, borderRadius: 10, alignItems: "center" }
});
