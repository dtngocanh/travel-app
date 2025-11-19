import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold mb-4">Your Bookings</Text>
        <Text className="mb-2">1. Beach Getaway - 20 Nov 2025</Text>
        <Text className="mb-2">2. Mountain Adventure - 25 Nov 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
