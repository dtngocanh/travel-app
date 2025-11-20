// import React from "react";
// import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";

// const HomeScreen = () => {
//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-6">
//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-4">
//         <View>
//           <Text className="text-2xl font-bold text-gray-900">Hi, Malinda</Text>
//           <Text className="text-gray-500 text-sm">📍 Jakarta, Indonesia</Text>
//         </View>
//         <View className="flex-row items-center space-x-3">
//           <TouchableOpacity className="p-2 bg-white rounded-full shadow">
//             <Ionicons name="notifications-outline" size={22} color="#f59e0b" />
//           </TouchableOpacity>
//           <Image
//             source={{ uri: "https://i.pravatar.cc/100" }}
//             className="w-10 h-10 rounded-full border-2 border-amber-500"
//           />
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl mb-6 shadow-sm">
//         <Ionicons name="search" size={20} color="#9ca3af" />
//         <TextInput
//           placeholder="Search for places..."
//           placeholderTextColor="#9ca3af"
//           className="ml-3 flex-1 text-gray-700"
//         />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Categories */}
//         <View className="flex-row justify-between items-center mb-3">
//           <Text className="text-lg font-semibold text-gray-800">Categories</Text>
//           <Text className="text-amber-500 font-semibold">View all</Text>
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
//           {[
//             { icon: "restaurant", label: "Restaurants" },
//             { icon: "bed", label: "Hotels" },
//             { icon: "car", label: "Gas" },
//             { icon: "cafe", label: "Coffee" },
//           ].map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               className="bg-amber-100 rounded-2xl w-20 h-20 mr-4 justify-center items-center"
//             >
//               <Ionicons name={item.icon as any} size={26} color="#f59e0b" />
//               <Text className="text-sm text-gray-700 mt-1 text-center">{item.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Places */}
//         <View className="flex-row justify-between items-center mb-3">
//           <Text className="text-lg font-semibold text-gray-800">Recommended Tours</Text>
//           <Text className="text-amber-500 font-semibold">View all</Text>
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {[
//             {
//               title: "Sand Castle",
//               img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
//               distance: "2.5km",
//             },
//             {
//               title: "Dream Beach",
//               img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixid=Mnwx",
//               distance: "3.7km",
//             },
//           ].map((place, index) => (
//             <View
//               key={index}
//               className="bg-white rounded-2xl mr-4 shadow w-52 overflow-hidden"
//             >
//               <Image source={{ uri: place.img }} className="w-full h-32" />
//               <TouchableOpacity className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full">
//                 <Ionicons name="heart-outline" size={18} color="#f59e0b" />
//               </TouchableOpacity>
//               <View className="p-3">
//                 <View className="flex-row items-center mb-1">
//                   <Text className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">
//                     HOT
//                   </Text>
//                 </View>
//                 <Text className="text-base font-semibold text-gray-900">{place.title}</Text>
//                 <View className="flex-row justify-between items-center mt-2">
//                   <View className="flex-row">
//                     <Image
//                       source={{ uri: "https://i.pravatar.cc/40?img=1" }}
//                       className="w-6 h-6 rounded-full -mr-2 border-2 border-white"
//                     />
//                     <Image
//                       source={{ uri: "https://i.pravatar.cc/40?img=2" }}
//                       className="w-6 h-6 rounded-full -mr-2 border-2 border-white"
//                     />
//                     <Image
//                       source={{ uri: "https://i.pravatar.cc/40?img=3" }}
//                       className="w-6 h-6 rounded-full border-2 border-white"
//                     />
//                   </View>
//                   <Text className="text-gray-500 text-sm">{place.distance}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </ScrollView>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAllTours } from "../../src/services/toursService.js";

const ToursScreen = () => {
  const [query, setQuery] = useState("");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await getAllTours();
      setTours(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Lỗi fetch tours:", error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={16} color="#f59e0b" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#f59e0b" />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#f59e0b"
        />
      );
    }
    return <View className="flex-row items-center mt-1">{stars}</View>;
  };

  const filteredTours =
    query.trim() === ""
      ? tours
      : tours.filter((tour) =>
        tour.name_tour?.toLowerCase().includes(query.toLowerCase())
      );

  // Trending destinations (lấy top 3 tour)
  const trendingTours = tours.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-gray-500 text-base">Hey Shanto,</Text>
          <Text className="text-2xl font-bold">Where to next?</Text>
        </View>

        <TouchableOpacity className="p-2 bg-white rounded-full shadow">
          <Ionicons name="notifications-outline" size={22} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-4">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder="Search worldwide"
          placeholderTextColor="#9ca3af"
          className="ml-3 flex-1 text-gray-700"
          onChangeText={setQuery}
          value={query}
        />
      </View>

      {/* Trending Destinations */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">Trending Destinations</Text>
        <TouchableOpacity>
          <Text className="text-amber-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={trendingTours}
        keyExtractor={(item) => item.id || item.id_tour}
        className="mb-6"
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4 rounded-2xl overflow-hidden w-40">
            <Image
              source={{ uri: item.image_tour }}
              className="w-40 h-40"
              resizeMode="cover"
            />
            {/* <View className="absolute bottom-2 left-2 bg-white/70 px-2 py-1 rounded">
              <Text className="font-semibold">{item.name_tour}</Text>
            </View> */}
          </TouchableOpacity>
        )}
      />

      {/* Popular Destinations */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">Popular Destinations</Text>
        <TouchableOpacity>
          <Text className="text-amber-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {loading ? (
          <Text className="text-center text-gray-500 mt-6">Loading...</Text>
        ) : (
          filteredTours.map((tour) => (
            <TouchableOpacity
              key={tour.id || tour.id_tour}
              activeOpacity={0.8}
              className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden"
            >
              <Image
                source={{ uri: tour.image_tour }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <TouchableOpacity className="absolute top-3 right-3 bg-white/80 p-2 rounded-full">
                <Ionicons name="heart-outline" size={20} color="#f59e0b" />
              </TouchableOpacity>
              <View className="p-4">
                <Text className="text-lg font-semibold text-gray-900">
                  {tour.name_tour}
                </Text>
                <Text className="text-gray-500 mt-1">
                  {tour.location_tour} • {tour.duration_tour}
                </Text>

                <View className="flex-row items-center mt-2">
                  {renderStars(tour.reviews_tour || 0)}
                  <Text className="text-gray-600 text-sm ml-2">
                    {tour.reviews_tour?.toFixed(1) || "0.0"}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-3">
                  <Text className="text-amber-600 font-semibold text-base">
                    ${tour.price_tour}
                  </Text>
                  <TouchableOpacity className="bg-amber-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-medium">Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToursScreen;

