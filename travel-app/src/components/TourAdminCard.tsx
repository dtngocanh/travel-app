import React, { FC } from "react";
import { View, Text, Image, Pressable } from "react-native";

export interface TourAdminCardProps {
  id: string;
  id_tour: number;
  title: string;
  price: number;
  duration: string;
  reviews: number;
  rating: number;
  imageUrl: string | { uri: string };
  location: string;
  onDelete?: (id: string) => void;
  onDetail?: () => void; // callback mở modal update
}

const TourAdminCard: FC<TourAdminCardProps> = ({
  id,
  title,
  price,
  duration,
  reviews,
  rating,
  imageUrl,
  location,
  onDelete,
  onDetail,
}) => {
  const img =
    typeof imageUrl === "string" ? imageUrl : imageUrl?.uri || "https://via.placeholder.com/150";

  return (
    <Pressable
      onPress={onDetail}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginBottom: 12,
        padding: 12,
      }}
    >
      <Image
        source={{ uri: img }}
        style={{
          width: "100%",
          height: 180,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
        resizeMode="cover"
      />

      <View style={{ marginTop: 8, gap: 4 }}>
        <Text style={{ fontSize: 14, color: "#16A34A", fontWeight: "600" }}>
          {"★".repeat(Math.floor(rating))} <Text style={{ color: "#6B7280" }}>· {reviews} Reviews</Text>
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>{title}</Text>

        <Text style={{ fontSize: 14, color: "#4B5563" }}>
          📍 <Text style={{ fontWeight: "600", color: "#111827" }}>{location}</Text>
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
          <Text style={{ color: "#4B5563" }}>
            Starting at <Text style={{ fontWeight: "700", color: "#111827" }}>${price}</Text>
          </Text>
          <Text style={{ color: "#6B7280" }}>{duration} days</Text>
        </View>

        {/* Chỉ còn nút Delete */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
          <Pressable
            onPress={() => onDelete?.(id)}
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default TourAdminCard;
