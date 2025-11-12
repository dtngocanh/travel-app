import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: '#F59E0B', 
        tabBarInactiveTintColor: 'gray', 
      }}
    >
      {/* Tab Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
           tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Tab Tours */}
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: ({ color, size }) => (<Ionicons name="compass" size={size} color={color} />), }}
      />

      {/* Tab Tours */}
      <Tabs.Screen
        name="mytrip"
        options={{ title: 'MyTrip', tabBarIcon: ({ color, size }) => (<Ionicons name="bag-outline" size={size} color={color} />), }}
      />

      
      {/* Tab Tours */}
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (<Ionicons name="person-outline" size={size} color={color} />), }}
      />
    </Tabs>
  );
}
