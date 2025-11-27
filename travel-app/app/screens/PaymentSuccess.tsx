import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";

export default function PaymentSuccess() {
    const router = useRouter();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Completed Payment",
        });
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-white p-5">
            <Text className="text-2xl font-bold mb-5">🎉 Payment Successful!</Text>
            <Text className="text-base mb-10 text-center">
                Thank you for booking your tour. Have a wonderful trip!
            </Text>

            <TouchableOpacity
                onPress={() => router.push("/")}
                className="bg-amber-500 px-8 py-4 rounded-lg"
                activeOpacity={0.8}
            >
                <Text className="text-white text-base font-semibold text-center">
                    Go Back Home
                </Text>
            </TouchableOpacity>
        </View>
    );
}
