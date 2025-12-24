import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { getAdminStats } from "../../src/services/bookingService";
import { BarChart } from "react-native-chart-kit";

const AdminHomeScreen: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getAdminStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          Loading statistics...
        </Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-4">

      {/* HEADER */}
      <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
         Admin Dashboard
      </Text>

      {/* STAT CARDS */}
      <View className="flex-row flex-wrap gap-4 mb-6">
        <View className="w-full md:w-[31%] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <Text className="text-gray-500 dark:text-gray-400">Total Bookings</Text>
          <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalBookings}
          </Text>
        </View>

        <View className="w-full md:w-[31%] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <Text className="text-gray-500 dark:text-gray-400">Paid Bookings</Text>
          <Text className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.totalPaid}
          </Text>
        </View>

        <View className="w-full md:w-[31%] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <Text className="text-gray-500 dark:text-gray-400">Total Revenue</Text>
          <Text className="text-3xl font-bold text-orange-500 dark:text-orange-400">
            ${stats.totalRevenue}
          </Text>
        </View>
      </View>

      {/* BAR CHART */}
      <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-6">
        <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
           Bookings Chart by Tour
        </Text>

        {stats.topTours.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        ) : (
          <BarChart
            data={{
              labels: stats.topTours.map(([id]: any) => String(id)),
              datasets: [{ data: stats.topTours.map(([, count]: any) => count) }],
            }}
            width={Dimensions.get("window").width - 40}
            height={260}
            yAxisLabel=""        
            yAxisSuffix=""       
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForBackgroundLines: { strokeWidth: 1, stroke: "#e5e7eb" },
            }}
            style={{ borderRadius: 16 }}
          />

        )}
      </View>

      {/* TOP TOUR LIST */}
      <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
        <Text className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
           Best Selling Tours
        </Text>

        {stats.topTours.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        ) : (
          stats.topTours.map(([tourId, count]: any, index: number) => (
            <View
              key={tourId}
              className="flex-row justify-between border-b border-gray-200 dark:border-gray-700 py-3"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                {index + 1}. Tour ID: {tourId}
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                {count} bookings
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default AdminHomeScreen;
