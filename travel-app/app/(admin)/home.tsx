import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { listenAdminSummary } from "../../src/services/bookingService"; 
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const AdminHomeScreen: React.FC = ({ navigation }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenAdminSummary((data) => {
      setStats(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-gray-500 mt-4 font-medium">Updating Dashboard...</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 pt-14">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-blue-600 text-xs font-black uppercase tracking-widest">Analytics</Text>
          <Text className="text-3xl font-black text-gray-900">Dashboard</Text>
        </View>
        <TouchableOpacity className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <Ionicons name="notifications-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* TỔNG QUAN DOANH THU (CHUYỂN SANG MÀU TRẮNG) */}
      <View className="bg-white p-8 rounded-[40px] mb-6 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-2">
          <View className="bg-emerald-100 p-2 rounded-lg mr-2">
            <Ionicons name="wallet" size={16} color="#10b981" />
          </View>
          <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">Total Revenue</Text>
        </View>
        
        <Text className="text-gray-900 text-4xl font-black">
          ${stats.totalRevenue.toLocaleString()}
        </Text>

        <View className="flex-row mt-6 justify-between border-t border-gray-50 pt-5">
          <View>
            <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">Paid</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className="text-gray-900 font-black text-xl">{stats.totalPaid}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">Pending</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-black text-xl">{stats.pendingPayments}</Text>
              <View className="w-2 h-2 rounded-full bg-orange-500 ml-2" />
            </View>
          </View>
        </View>
      </View>

      {/* QUICK STATS (Users & Tours) */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-white w-[48%] p-6 rounded-[35px] shadow-sm border border-gray-100">
          <View className="bg-blue-50 w-12 h-12 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="people" size={24} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-black text-gray-900">{stats.totalUsers}</Text>
          <Text className="text-gray-400 text-[10px] font-bold uppercase">Users</Text>
        </View>

        <View className="bg-white w-[48%] p-6 rounded-[35px] shadow-sm border border-gray-100">
          <View className="bg-purple-50 w-12 h-12 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="map" size={24} color="#a855f7" />
          </View>
          <Text className="text-2xl font-black text-gray-900">{stats.activeTours}</Text>
          <Text className="text-gray-400 text-[10px] font-bold uppercase">Tours</Text>
        </View>
      </View>

      {/* BIỂU ĐỒ SALES */}
      <View className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-sm font-black text-gray-900 uppercase tracking-widest">Performance</Text>
          <Ionicons name="stats-chart" size={18} color="#d1d5db" />
        </View>
        
        {stats.topTours.length > 0 ? (
          <BarChart
            data={{
              labels: stats.topTours.slice(0, 3).map(([name]: any) => name.substring(0, 5) + "."),
              datasets: [{ data: stats.topTours.slice(0, 3).map(([, count]: any) => count) }],
            }}
            width={width - 80}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              barPercentage: 0.6,
              propsForBackgroundLines: {
                strokeDasharray: "", 
                stroke: "#f3f4f6"
              }
            }}
            style={{ borderRadius: 16, paddingRight: 40 }}
            fromZero
          />
        ) : (
          <View className="h-40 items-center justify-center">
             <Text className="text-gray-400">No data available</Text>
          </View>
        )}
      </View>

      {/* TOP TOUR LIST */}
      <View className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 mb-10">
        <Text className="text-gray-900 font-black text-lg mb-6">Leaderboard</Text>
        {stats.topTours.map(([name, count]: any, index: number) => (
          <View key={index} className="flex-row items-center justify-between py-4 border-b border-gray-50">
            <View className="flex-row items-center flex-1">
              <View className="bg-gray-50 w-10 h-10 rounded-full items-center justify-center mr-4">
                <Text className="font-black text-blue-600">{index + 1}</Text>
              </View>
              <Text className="font-bold text-gray-800 flex-1" numberOfLines={1}>{name}</Text>
            </View>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="font-black text-blue-600 text-xs">{count} Sold</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminHomeScreen;