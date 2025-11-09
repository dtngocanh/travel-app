import { Stack } from 'expo-router';
import { createContext } from 'react';
import { colors, fonts } from '../theme';

export const ThemeContext = createContext({ colors, fonts });

export default function RootLayout() {
  return (

     <ThemeContext.Provider value={{ colors, fonts }}>
        <Stack>
               <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack>
      </ThemeContext.Provider>

//     <Stack>
//       <Stack.Screen name="(customer)" options={{ headerShown: false }} />
//     </Stack>

  );
}
