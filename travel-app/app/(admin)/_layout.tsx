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
        name="home"
        options={{
          title: 'Home',
           tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* Tab Tours */}
      <Tabs.Screen
        name="userlist"
        options={{ title: 'Manage User', tabBarIcon: ({ color, size }) => (<Ionicons name="person-outline" size={size} color={color} />), }}
      />
    </Tabs>
  );
}
