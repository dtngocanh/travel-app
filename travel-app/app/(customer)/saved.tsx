import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold mb-4">Saved Tours</Text>
        <Text className="mb-2">🌴 Beach Getaway</Text>
        <Text className="mb-2">🏞 Mountain Adventure</Text>
        <Text className="mb-2">🏛 Cultural Tour</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
