import React, { useState } from "react";
import { TouchableOpacity, Text, Alert, Animated, View, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { db, auth } from "../../utils/firebase";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useNotification } from "../contexts/NotificationContext";

type Tour = {
  id: string;
  name_tour: string;
  price_tour: number;
  location_tour: string;
  duration_tour: string;
  image_tour: string;
  reviews_tour: number;
};

interface PaymentButtonProps {
  clientSecret: string;
  tour: Tour;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ clientSecret, tour }) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {addNotification} = useNotification();


  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!auth.currentUser) return Alert.alert("Error", "User not logged in");
      const userId = auth.currentUser.uid;

      // Init PaymentSheet
      const initResponse = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "TripGo"
      });
      if (initResponse.error) return Alert.alert("Error", initResponse.error.message);

      // Present PaymentSheet
      const { error } = await stripe.presentPaymentSheet();
      if (error) return Alert.alert("Error", error.message);

      // Lưu booking vào Firebase
      const bookingRef = doc(collection(db, "bookings"));
      await setDoc(bookingRef, {
        id: bookingRef.id,
        userId,
        tourId: tour.id,
        tourData: tour,
        amount: tour.price_tour,
        status: "paid",
        createdAt: serverTimestamp(),
      });

      await addNotification(tour.id, tour.name_tour);

      router.push("./PaymentSuccess")
    } catch (err: any) {
      // console.error(err);
      Alert.alert("Error", "Payment or saving booking failed!");
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity
        onPress={handlePayment}
        style={{
          backgroundColor: "#F59E0B",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );

};
