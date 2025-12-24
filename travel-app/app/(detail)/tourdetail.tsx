import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getTourById, getTripDetailsByTourId } from "../../utils/api"; 
import { useBooking } from "../../src/contexts/BookingContext";

// --- IMPORT GIỐNG INDEX ---
import { db } from "../../utils/firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../src/contexts/AuthContex";

import ExpandableItem from './tripdetail';
import Specifications from './Info_tour';

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
  const { user } = useAuth(); // Lấy user giống index
  const { setSelectedTour } = useBooking();

  const [tourDetails, setTourDetails] = useState<TourDetails | null>(null);
  const [tripItineraries, setTripItineraries] = useState<TripDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích

  const isWeb = Platform.OS === "web";
  const firstTripItem = tripItineraries.length > 0 ? tripItineraries[0] : null;

  // --- LOGIC YÊU THÍCH GIỐNG INDEX ---
  useEffect(() => {
    if (!user?.uid || !id) return;
    const favRef = doc(db, "users", user.uid, "favorites", id.toString());
    return onSnapshot(favRef, (snap) => {
      setIsFavorite(snap.exists());
    });
  }, [user?.uid, id]);

  const toggleFavorite = async () => {
    if (!user?.uid) return alert("Please login!");
    const ref = doc(db, "users", user.uid, "favorites", id!.toString());
    isFavorite ? await deleteDoc(ref) : await setDoc(ref, { addedAt: new Date() });
  };

  // --- LOGIC ĐẶT HÀNG GIỐNG INDEX ---
  const handleBooking = (tour: any) => {
    setSelectedTour(tour);
    router.push("../screens/SelectDateScreen");
  };

  const fetchTourDetails = async (tourId: string | string[]) => {
    try {
      const res = await getTourById(tourId as string);
      setTourDetails(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (tourId: string) => {
    const res = await getTripDetailsByTourId(tourId);
    setTripItineraries(res.data);
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

  // web layout
  if (isWeb) {
    return (
        <View style={{ flex: 1, backgroundColor: "#fafafa", alignItems: "center" }}>
        <Stack.Screen options={{ headerTitle: tour.name_tour }} />
        <ScrollView showsVerticalScrollIndicator={true}>
        <View style={{ width: 1440, padding: 10 }}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            {/* Left column */}
            <View style={{ flex: 2 }}>
              <Image
                source={{ uri: tour.image_tour }}
                style={{ width: "100%", height: 450, borderRadius: 16 }}
              />

              {/* Sửa div thành View và thêm check crash */}
              {firstTripItem && (
                <View style={{ marginTop: 20 }}>
                  <Specifications content={firstTripItem} />
                </View>
              )}

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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 28, fontWeight: "bold", flex: 1 }}>{tour.name_tour}</Text>
                  {/* Nút yêu thích trên Web */}
                  <TouchableOpacity onPress={toggleFavorite}>
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ef4444" : "#333"} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 20, color: "#f59e0b", marginVertical: 10 }}>
                  ${tour.price_tour}
                </Text>
                <TouchableOpacity
                  onPress={() => handleBooking(tour)}
                  style={{
                    padding: 14,
                    backgroundColor: "#f59e0b",
                    borderRadius: 10,
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16, fontWeight: '600' }}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      </View>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const safeRating = Number(rating ?? 0);
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        let name: 'star' | 'star-half' | 'star-outline' = 'star-outline';
        if (i < fullStars) name = 'star';
        else if (i === fullStars && hasHalfStar) name = 'star-half';
        stars.push(<Ionicons key={`star-${i}`} name={name} size={16} color="#f59e0b" />);
    }
    return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>{stars}</View>;
  };

  // mobile
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: '',   
          headerRight: () => ( 
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 20 }}>
                <Ionicons name="share-social-outline" size={24} color="#333" />
              </TouchableOpacity>
              {/* Logic yêu thích Mobile */}
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorite ? "#ef4444" : "#FF6347"}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
        />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: tour.image_tour }} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.title}>{tour.name_tour}</Text>
          <Text style={{ color: "#f59e0b", fontSize: 20, fontWeight: "bold" }}>${tour.price_tour}</Text>
          <Text style={{ fontWeight: "600", marginVertical: 10 }}>Duration • {tour.duration_tour}</Text>
              <View style={{ gap: 8 }}>
            <Text style={{ color: "#555", lineHeight: 22 }}>{tour.location_tour}.</Text>
            
             <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  {renderStars(tour.reviews_tour || 0)}
                  <Text style={{ marginLeft: 8, color: "#555" }}>
                   {Number(tour.reviews_tour ?? 0).toFixed(1)}/5
                </Text>
              </View>
          </View>
        </View>

        {/* Chống crash mobile */}
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
        <TouchableOpacity  onPress={() => handleBooking(tour)} style={styles.button}>
          <Text style={{ color: "white", fontSize: 16 }}>Book Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
      
    </View>
  );
}

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