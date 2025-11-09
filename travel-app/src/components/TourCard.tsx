import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TourCardProps {
  title: string;
  price: number;
  duration: string;
  reviews: number;
  rating: number;
  imageUrls: string[];
}

const TourCard: FC<TourCardProps> = ({
  title,
  price,
  duration,
  reviews,
  rating,
  imageUrls,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow mb-5 p-3">
      {/* Grid ảnh */}
      <View className="flex-row justify-between space-x-2">
        <Image
          source={{ uri: imageUrls[0] }}
          className="w-[45%] h-28 rounded-xl"
          resizeMode="cover"
        />

        <View className="w-[45%] flex flex-col space-y-2">
          <Image
            source={{ uri: imageUrls[1] }}
            className="w-full h-[40%] rounded-xl"
            resizeMode="cover"
          />

          <View className="flex-row justify-between">
            <Image
              source={{ uri: imageUrls[2] }}
              className="w-[45%] h-[60px] rounded-xl"
              resizeMode="cover"
            />
            <View className="w-[45%] h-[60px] bg-gray-100 rounded-xl items-center justify-center">
              <Text className="text-gray-600 font-semibold">+40</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Thông tin */}
      <View className="mt-3 space-y-1">
        <Text className="text-sm">
          <Text className="text-green-600 font-semibold">
            {"★".repeat(Math.floor(rating))}
          </Text>
          <Text className="text-gray-500">  · Very good {reviews} Reviews</Text>
        </Text>

        <Text className="text-gray-900 font-semibold text-lg">{title}</Text>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">
            Starting at <Text className="font-bold text-gray-900">${price}</Text>
          </Text>
          <Text className="text-gray-500">{duration}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-amber-500 rounded-md px-4 py-2"
          >
            <Text className="text-white font-semibold">Book Now</Text>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-2">
            <Ionicons name="checkmark-circle-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm">Trusted Partner</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TourCard;
