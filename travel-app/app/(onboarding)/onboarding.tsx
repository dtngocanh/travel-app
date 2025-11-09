import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import '../../global.css';
import { ThemeContext } from '../_layout';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);

  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Raleway-Regular': require('../../assets/fonts/Raleway-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Image
        source={require('../../assets/images/onboarding.png')}
        style={{ width: '100%', height: '60%' }}
        resizeMode="stretch"
      />

      <View className="px-6 mt-10 pb-5">
        <Text
          style={{ fontFamily: fonts.bold, color: colors.text }}
          className="text-4xl text-center my-3"
        >
          TripGo
        </Text>

        <Text
          style={{ fontFamily: fonts.regular, color: colors.grayText }}
          className="text-base text-center mb-10"
        >
          The ultimate travel app for easy multi-city adventures.{"\n"}
          Plan, book, and explore hassle-free.
        </Text>

        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="w-full py-4 rounded-2xl mt-6"
          onPress={() => router.replace('/(customer)')}
        >
          <Text
            style={{ fontFamily: fonts.bold, color: '#fff' }}
            className="text-center text-lg"
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
