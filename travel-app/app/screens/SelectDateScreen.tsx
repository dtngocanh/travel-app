import { useRouter } from "expo-router";
import { useBooking } from "../../src/contexts/BookingContext";
import { useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

export default function SelectDateScreen() {
  const router = useRouter();
  const { selectedTour, setSelectedDate } = useBooking();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Select Start Date",
    });
  }, []);

  const handleContinue = () => {
    setSelectedDate(date);
    router.push("./PaymentScreen");
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View className="flex-1 bg-gray-50 justify-center items-center p-4">
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        {/* Title */}
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Select Date For
        </Text>
        <Text className="text-gray-600 mb-6 text-center">
          <Text className="font-semibold">{selectedTour?.name_tour}</Text>
        </Text>

        {/* Web date picker */}
        {Platform.OS === "web" ? (
          <View className="mb-6">
            <input
              type="date"
              value={date.toISOString().split("T")[0]}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full p-3 border rounded-lg text-gray-700"
            />
          </View>
        ) : (
          <>
            {/* Mobile picker */}
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onChange}
                minimumDate={new Date()}
                className="w-full mb-4"
              />
            )}

            {Platform.OS === "android" && (
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                className="bg-gray-200 rounded-md py-2 px-4 mb-4"
              >
                <Text className="text-gray-700 text-center">
                  {date.toDateString()}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="w-full bg-amber-500 py-3 rounded-full text-white font-semibold text-lg"
        >
          <Text className="text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}