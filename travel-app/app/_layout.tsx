import React, { createContext, useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { colors, fonts } from '../theme';
import { useFonts } from 'expo-font';
import { ActivityIndicator, Platform } from 'react-native';
import FlashMessage from "react-native-flash-message";
<<<<<<< HEAD
import { app } from '../utils/firebase';

=======
import PaymentProvider from '../src/components/PaymentProvider';
import { BookingProvider } from "../src/contexts/BookingContext";
import { AuthProvider } from '../src/contexts/AuthContex';
import { NotificationProvider } from '../src/contexts/NotificationContext';
>>>>>>> feab1b1ab419a5589c1188d1a46be380ab9686ed
export const ThemeContext = createContext({ colors, fonts });


export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),
    'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf')
  });

  const [ready, setReady] = useState(false);


  // Đợi layout mount xong
<<<<<<< HEAD
  useEffect(() => {
   if (Platform.OS === 'web') {
        // Sử dụng dynamic import để tải gói Firebase Analytics Web SDK
        import('firebase/analytics')
            .then(({ initializeAnalytics }) => {
                // Khởi tạo Analytics bằng đối tượng app đã được import
                initializeAnalytics(app); 
                console.log("Firebase Analytics Web SDK initialized successfully.");
            })
            .catch(e => console.warn("Web Analytics failed to initialize:", e));
    }
  }, []);
=======
  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     setTimeout(() => {
  //       router.replace('/(auth)/login');
  //     }, 0);
  //   }
  // }, []);

>>>>>>> feab1b1ab419a5589c1188d1a46be380ab9686ed

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }


  return (
    <AuthProvider>
    <ThemeContext.Provider value={{ colors, fonts }}>
      <NotificationProvider>
      <PaymentProvider>
        <BookingProvider>
          <Stack>
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            <Stack.Screen name="(customer)" options={{ headerShown: false }} />

            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            <Stack.Screen name="screens" options={{ headerShown: false }} />
          </Stack>
        </BookingProvider>
      </PaymentProvider>
      </NotificationProvider>

      <FlashMessage
        position="center"
        floating={true}
        style={{
          borderRadius: 16,
          width: '80%',
          height: '30%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        textStyle={{
          textAlign: 'center',
          fontFamily: 'Raleway-Regular',
          fontSize: 16,
          color: colors.background
        }}
      />

    </ThemeContext.Provider>
    </AuthProvider>
  );
}
