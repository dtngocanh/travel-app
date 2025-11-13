import { Stack } from 'expo-router';
import { createContext } from 'react';
import { colors, fonts } from '../theme';
import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native';
import FlashMessage from "react-native-flash-message";

export const ThemeContext = createContext({ colors, fonts });

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'), 
    'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),
    'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf')
  });

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
  return (

    <ThemeContext.Provider value={{ colors, fonts }}>
      <Stack>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="pages" options={{ headerShown: false }} />
        <Stack.Screen
          name="pages/detail"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
      <FlashMessage position="center" floating={true} style={{ borderRadius: 16, width: '80%', height: '30%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} textStyle={{ textAlign: 'center', fontFamily: 'Raleway-Regular', fontSize: 16, color: colors.background }} />
    </ThemeContext.Provider>
   
  );
}
