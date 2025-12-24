import React, { useState } from "react";
import { db, auth } from "../../utils/firebase";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { useStripe, useElements, CardElement, CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { useRouter } from "expo-router";
import { useNotification } from "../contexts/NotificationContext";
import { useBooking } from "../contexts/BookingContext";

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
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotification();

  const { clearBooking } = useBooking();

  const router = useRouter();
  const handlePayment = async () => {
    if (loading || !stripe || !elements) return;
    try {
      setLoading(true);
      if (!auth.currentUser) throw new Error("User not logged in");
      const userId = auth.currentUser.uid;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      if (error) throw new Error(error.message);

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

      clearBooking();
      router.push("./PaymentSuccess")
      // alert("Payment completed and booking saved!");
    } catch (err: any) {
      // console.error(err);
      alert(err.message || "Payment or saving booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md space-y-4">
      <h3 className="text-md font-semibold mb-4">Payment details</h3>

        <div className="p-4 border rounded-md bg-gray-50 mb-4">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#111827",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>

      <button
        onClick={handlePayment}
        disabled={loading || !stripe}
        className={`w-full py-3 rounded-md text-white font-semibold transition-colors
        ${loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"}`}
      >
        {loading ? "Processing..." : `Pay $${tour.price_tour.toFixed(2)}`}
      </button>
    </div>
  );
};
