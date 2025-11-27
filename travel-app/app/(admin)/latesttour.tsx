import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Platform, // <--- Nhớ import Platform
} from "react-native";

import TourAdminCard, { TourAdminCardProps } from "../../src/components/TourAdminCard";
import CreateTourModal from "./_createtourmodal";
import UpdateTourModal from "./_updatetourmodal";
import { getLatestToursService, Tour as TourData } from "../../src/services/tourService";
import { deleteTourService } from "../../utils/api_admin";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

// Cấu hình khoảng cách
const CONTAINER_PADDING = 16;
const GAP = 12;

const LatestToursAdmin: React.FC = () => {
  const [tours, setTours] = useState<TourData[]>([]);
  const [loading, setLoading] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourData | null>(null);

  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 2 : 1;

  // --- Load Data ---
  useEffect(() => {
    setLoading(true);
    const unsubscribe = getLatestToursService(10, (newTours) => {
      setTours(newTours);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Delete (ĐÃ SỬA CHO WEB) ---
  const handleDelete = useCallback((id: string) => {
    // Hàm thực hiện xóa (tách riêng để tái sử dụng)
    const performDelete = async () => {
      try {
        if (!id.startsWith("temp_")) await deleteTourService(id);
        setTours((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        Alert.alert("Error", "Failed to delete");
      }
    };

    // LOGIC RIÊNG CHO TỪNG NỀN TẢNG
    if (Platform.OS === 'web') {
      // Trên Web dùng window.confirm
      const confirmed = window.confirm("Are you sure you want to delete this tour?");
      if (confirmed) {
        performDelete();
      }
    } else {
      // Trên Mobile dùng Alert.alert
      Alert.alert("Delete Tour", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: performDelete,
        },
      ]);
    }
  }, []);

  // --- Handlers ---
  const handleDetail = useCallback((tour: TourData) => {
    setSelectedTour(tour);
    setUpdateModalVisible(true);
  }, []);

  const handleCreated = useCallback((newTour: TourData) => {
    setTours((prev) => [{ ...newTour, id: newTour.id || `temp_${Date.now()}` }, ...prev]);
    setCreateModalVisible(false);
  }, []);

  const handleUpdated = useCallback((updatedTour: TourData) => {
    setTours((prev) => prev.map((t) => (t.id === updatedTour.id ? updatedTour : t)));
    setUpdateModalVisible(false);
    setSelectedTour(null);
  }, []);

  // --- Helpers ---
  const getImageUri = (image: any) => {
    if (typeof image === "string") return image;
    return image?.uri || PLACEHOLDER_IMAGE;
  };

  // --- Layout Calculations ---
  const availableWidth = width - (CONTAINER_PADDING * 2);
  const itemWidth = (availableWidth - ((numColumns - 1) * GAP)) / numColumns;

  // Format Data
  const formattedTours: TourAdminCardProps[] = tours.map((t) => ({
    id: t.id,
    id_tour: t.id_tour,
    title: t.name_tour,
    price: t.price_tour,
    duration: t.duration_tour,
    reviews: t.reviews_tour || 0,
    rating: t.reviews_tour || 0,
    imageUrl: getImageUri(t.image_tour),
    location: t.location_tour || "Unknown",
    onDelete: handleDelete,
    onDetail: () => handleDetail(t),
  }));

  const visibleTours = formattedTours.filter((t) => t.title);

  const renderItem = ({ item }: { item: TourAdminCardProps }) => (
    <View style={{ width: itemWidth }}>
      <TourAdminCard {...item} />
    </View>
  );

  return (
    <View className="flex-1 pt-4 px-4 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-800">Tour Management</Text>
        <TouchableOpacity
          className="bg-blue-600 py-2.5 px-4 rounded-lg shadow-sm active:opacity-80"
          onPress={() => setCreateModalVisible(true)}
        >
          <Text className="text-white font-semibold">Create Tour</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-2">Loading tours...</Text>
        </View>
      ) : visibleTours.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No tours found.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleTours}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns}
          columnWrapperStyle={numColumns > 1 ? { gap: GAP } : undefined}
          contentContainerStyle={{ paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modals */}
      <CreateTourModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreated={handleCreated}
      />

      {selectedTour && (
        <UpdateTourModal
          visible={updateModalVisible}
          tour={selectedTour}
          onClose={() => {
            setUpdateModalVisible(false);
            setSelectedTour(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
    </View>
  );
};

export default LatestToursAdmin;