import React, { useState, useEffect, useLayoutEffect } from "react";
import { Image, View, Text, Alert, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native";
import { useBooking } from "../../src/contexts/BookingContext";
import { createPaymentIntent } from "../../utils/api";
import { PaymentButton } from "../../src/components/PaymentButton";
import { auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";

export default function PaymentScreen() {
  const { selectedTour, selectedDate } = useBooking();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { width } = useWindowDimensions();   
  const isLargeScreen = width >= 768;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Confirm Tour Information",
    });
  }, []);

  useEffect(() => {
    if (clientSecret || !selectedTour) return;
    const fetchPaymentIntent = async () => {
      setLoading(true);
      try {
        const res = await createPaymentIntent(selectedTour.id);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        // console.error(err);
        Alert.alert("Error", "Cannot create payment intent");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentIntent();
  }, [selectedTour]);

  useEffect(() => {
    return () => {
      setClientSecret(null);
    };
  }, []);

  if (!selectedTour || !selectedDate) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No tour selected</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">

      <View className={`${isLargeScreen ? 'flex-row space-x-6' : ''}`}>
        <View className={`${isLargeScreen ? 'w-1/2' : ''}`}>

          {/* Tour Info */}
          <View className="mb-6 bg-white rounded-2xl shadow-sm p-4">
            {selectedTour.image_tour && (
              <Image
                source={{ uri: selectedTour.image_tour }}
                className="w-full h-48 rounded-2xl mb-4"
                resizeMode="cover"
              />
            )}
            <Text className="text-xl font-bold text-amber-700 mb-2">{selectedTour.name_tour}</Text>
            <Text className="text-gray-600 mb-1">Date: {selectedDate.toDateString()}</Text>
            <Text className="text-gray-600 mb-1">
              Price: <Text className="text-amber-500 font-semibold">${selectedTour.price_tour}</Text>
            </Text>
            <Text className="text-gray-600 mb-1">Location: {selectedTour.location_tour}</Text>
            <Text className="text-gray-600 mb-1">Duration: {selectedTour.duration_tour}</Text>
            <Text className="text-gray-600 mb-1">Reviews: {selectedTour.reviews_tour} ⭐</Text>
          </View>


          {/* User Info */}
          <View className="mb-6 p-4 bg-gray-100 rounded-xl shadow-inner">
            <Text className="font-semibold text-amber-700 text-lg mb-2">User Information</Text>
            <Text className="text-gray-600 mb-1">Email: {auth.currentUser?.email || "Not logged in"}</Text>
            <Text className="text-gray-600">UID: {auth.currentUser?.uid || "-"}</Text>
          </View>
        </View>
        {/* Payment */}
        <View className={`${isLargeScreen ? 'w-1/2' : 'mb-6'}`}>


          {loading ? (
            <ActivityIndicator size="large" className="bg-amber-700" />
          ) : clientSecret ? (
            <PaymentButton key={clientSecret} clientSecret={clientSecret} tour={selectedTour} />
          ) : (
            <Text className="text-gray-500 text-center">Loading payment...</Text>
          )}

        </View>

      </View>

    </ScrollView>
  );
}
