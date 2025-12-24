import React from "react";
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TourCardProps {
  item: any;
  cardWidth?: number;
  favoriteIds?: string[];
  toggleFavorite?: (tour: any) => void;
  handleBookNow?: (tour: any) => void;
}

const TourCard: React.FC<TourCardProps> = ({
  item,
  cardWidth = 300,
  favoriteIds = [],
  toggleFavorite,
  handleBookNow,
}) => {

  const rating = Number(item.reviews_tour) || 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#f59e0b" />);
    if (hasHalfStar) stars.push(<Ionicons key="half" name="star-half" size={16} color="#f59e0b" />);
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#f59e0b" />);
    return <View className="flex-row items-center mt-1">{stars}</View>;
  };

  return (
    <View
      style={{
        width: cardWidth,
        marginBottom: 16,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: item.image_tour }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: 8,
          borderRadius: 999,
        }}
        onPress={() => toggleFavorite && toggleFavorite(item)}
      >
        <Ionicons
          name={favoriteIds.includes(item.id) ? "heart" : "heart-outline"}
          size={20}
          color="#f59e0b"
        />
      </TouchableOpacity>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }} numberOfLines={1}>
          {item.name_tour}
        </Text>
        <Text style={{ color: "#6b7280", marginTop: 4, fontSize: 12 }} numberOfLines={1}>
          {item.location_tour} • {item.duration_tour}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          {renderStars(rating)}
          <Text style={{ color: "#4b5563", fontSize: 12, marginLeft: 4 }}>{rating.toFixed(1)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <Text style={{ color: "#d97706", fontWeight: "600", fontSize: 16 }}>${item.price_tour}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#f59e0b", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999 }}
            onPress={() => handleBookNow && handleBookNow(item)}
          >
            <Text style={{ color: "#fff", fontWeight: "500" }}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TourCard;
