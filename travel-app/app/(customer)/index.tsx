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
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";

// Firebase & Utils
import { db } from "../../utils/firebase";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { getAllTours } from "../../utils/api";

// Contexts
import { useBooking } from "../../src/contexts/BookingContext";
import { useAuth } from "../../src/contexts/AuthContex";
import { useNotification } from "../../src/contexts/NotificationContext";

const ToursScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setSelectedTour } = useBooking();
  const { notifications } = useNotification();

  const [query, setQuery] = useState("");
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  const { width } = useWindowDimensions();
  // Ngưỡng để xác định giao diện Web/Tablet
  const isWebLayout = width >= 768;
  const numColumns = width >= 1024 ? 4 : width >= 768 ? 2 : 1;
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await getAllTours();
        setTours(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    return onSnapshot(collection(db, "users", user.uid, "favorites"), (snap) => {
      setUserFavorites(snap.docs.map(d => d.id));
    });
  }, [user?.uid]);

  const handleTourPress = (tour: any) => {
    router.push(`/(detail)/tourdetail?id=${tour.id || tour.id_tour}`);
  };

  const toggleFavorite = async (tourId: string) => {
    if (!user?.uid) return alert("Please login!");
    const ref = doc(db, "users", user.uid, "favorites", tourId);
    userFavorites.includes(tourId) ? await deleteDoc(ref) : await setDoc(ref, { addedAt: new Date() });
  };

  const renderTourItem = ({ item }: any) => {
    const tourId = (item.id || item.id_tour).toString();
    const isFavorite = userFavorites.includes(tourId);
    // Tính toán độ rộng card dựa trên số cột
    const cardWidth = (width - 32 - (numColumns - 1) * 16) / numColumns;

    return (
      <TouchableOpacity 
        style={[styles.card, { width: cardWidth }]} 
        onPress={() => handleTourPress(item)}
      >
        <Image source={{ uri: item.image_tour || "https://via.placeholder.com/150" }} style={styles.cardImage} />
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(tourId)}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#9ca3af"} />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text numberOfLines={1} style={styles.cardTitle}>{item.name_tour}</Text>
          <Text style={styles.cardLoc}>{item.location_tour}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>${item.price_tour}</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={() => { setSelectedTour(item); router.push("../screens/SelectDateScreen"); }}>
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeSub}>Welcome back,</Text>
              <Text style={styles.welcomeName}>{user?.firstName || "Guest"}</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              {/* HIỂN THỊ 5 TAB NAVIGATION TRÊN WEB */}
              {isWebLayout && (
                <View style={styles.webNav}>
                  <TouchableOpacity onPress={() => router.push("/")}>
                    <Text style={[styles.navText, { color: '#f59e0b' }]}>Explore</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/mytrip")}>
                    <Text style={styles.navText}>My Trip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/booking")}>
                    <Text style={styles.navText}>Plan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/favorites")}>
                    <Text style={styles.navText}>Favorites</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Text style={styles.navText}>Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <TouchableOpacity onPress={() => router.push("../screens/NotificationsScreen")} style={styles.notiBtn}>
                <Ionicons name="notifications-outline" size={24} color="#f59e0b" />
                {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: 'white' },
          headerShadowVisible: false,
        }}
      />

      {loading ? (
        <ActivityIndicator color="#f59e0b" size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={tours.filter(t => t.name_tour?.toLowerCase().includes(query.toLowerCase()))}
          keyExtractor={(item, index) => (item.id || item.id_tour || index).toString()}
          numColumns={numColumns}
          key={numColumns} // Force re-render khi đổi số cột
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput placeholder="Search destinations..." style={styles.searchInput} value={query} onChangeText={setQuery} />
              </View>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={tours.slice(0, 5)}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.trendingItem} onPress={() => handleTourPress(item)}>
                    <Image source={{ uri: item.image_tour }} style={styles.trendingImg} />
                    <View style={styles.trendingOverlay}>
                      <Text style={styles.trendingText} numberOfLines={1}>{item.name_tour}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={{ marginBottom: 25 }}
              />
              <Text style={styles.sectionTitle}>Popular Destinations</Text>
            </View>
          }
          renderItem={renderTourItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          columnWrapperStyle={numColumns > 1 ? { gap: 16, marginBottom: 16 } : null}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerLeft: { paddingLeft: 16 },
  welcomeSub: { fontSize: 12, color: '#6b7280' },
  welcomeName: { fontSize: 18, fontWeight: 'bold', color: '#92400e' },
  headerRight: { flexDirection: 'row', alignItems: 'center', paddingRight: 16, gap: 20 },
  
  // Style cho 5 Tabs trên Web
  webNav: { 
    flexDirection: 'row', 
    gap: 30, // Khoảng cách giữa các tab
    marginRight: 20,
    alignItems: 'center'
  },
  navText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#4b5563',
    paddingVertical: 8
  },

  notiBtn: { padding: 4 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: 'red', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  listHeader: { marginTop: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, marginBottom: 25 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1f2937' },
  trendingItem: { marginRight: 15, borderRadius: 20, overflow: 'hidden' },
  trendingImg: { width: 140, height: 180 },
  trendingOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.4)' },
  trendingText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' },
  cardImage: { width: '100%', height: 180 },
  favBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', padding: 6, borderRadius: 20, elevation: 2 },
  cardContent: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  cardLoc: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#f59e0b' },
  bookBtn: { backgroundColor: '#f59e0b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});

export default ToursScreen;