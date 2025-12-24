import React, { useEffect, useState, useMemo } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, 
  ActivityIndicator, TextInput, ScrollView, Alert 
} from "react-native";
import { listenBookingsRealtime } from "../../src/services/bookingRealtime";
import { exportBookingsToCSV } from "../../utils/exportBookingToCSV";
import { Ionicons } from "@expo/vector-icons";

const AdminBookingManager = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Real-time listener for Firestore
    const unsubscribe = listenBookingsRealtime((data) => {
      setBookings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- DATA ANALYTICS ---
  const stats = useMemo(() => {
    const total = bookings.length;
    const paidCount = bookings.filter(b => b.status === 'paid').length;
    const revenue = bookings
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    return { total, paidCount, revenue };
  }, [bookings]);

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return bookings.filter(item => {
      const tourName = item.tourData?.name_tour?.toLowerCase() || "";
      const matchSearch = tourName.includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === "all" || item.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [bookings, searchQuery, filterStatus]);

  const handleExport = () => {
    if (filteredData.length === 0) {
      Alert.alert("Notice", "No matching data to export!");
      return;
    }
    exportBookingsToCSV(filteredData);
  };

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-4 text-gray-500 font-medium">Loading real-time data...</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 pt-14">
      {/* HEADER & EXPORT */}
      <View className="px-4 flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-3xl font-extrabold text-gray-900">Bookings</Text>
          <Text className="text-gray-500 font-medium">Manage system transactions</Text>
        </View>
        <TouchableOpacity 
          onPress={handleExport}
          className="bg-green-600 p-3 rounded-2xl shadow-lg flex-row items-center"
        >
          <Ionicons name="cloud-download" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Export</Text>
        </TouchableOpacity>
      </View>

      {/* QUICK STATS PANEL */}
      <View className="px-4 mb-6 flex-row justify-between">
        <View className="bg-blue-500 w-[31%] p-3 rounded-2xl shadow-sm">
          <Text className="text-blue-100 text-[10px] font-bold uppercase">Total</Text>
          <Text className="text-white text-lg font-black">{stats.total}</Text>
        </View>
        <View className="bg-emerald-500 w-[31%] p-3 rounded-2xl shadow-sm">
          <Text className="text-emerald-100 text-[10px] font-bold uppercase">Success</Text>
          <Text className="text-white text-lg font-black">{stats.paidCount}</Text>
        </View>
        <View className="bg-orange-500 w-[31%] p-3 rounded-2xl shadow-sm">
          <Text className="text-orange-100 text-[10px] font-bold uppercase">Revenue</Text>
          <Text className="text-white text-lg font-black">${stats.revenue.toLocaleString()}</Text>
        </View>
      </View>

      {/* SEARCH & FILTER BAR */}
      <View className="px-4 mb-4">
        <View className="bg-white flex-row items-center px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search by tour name or location..."
            className="flex-1 ml-2 h-10 text-gray-800"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 flex-row">
          {['all', 'paid', 'pending', 'complete'].map((status) => (
            <TouchableOpacity 
              key={status}
              onPress={() => setFilterStatus(status)}
              className={`mr-2 px-5 py-2 rounded-full border ${
                filterStatus === status ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`font-bold capitalize ${filterStatus === status ? 'text-white' : 'text-gray-500'}`}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* DATA LIST */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.firestoreId}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isPaid = item.status === 'paid';
          const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt);

          return (
            <TouchableOpacity 
              activeOpacity={0.7}
              className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Booking ID: {item.firestoreId.slice(-8).toUpperCase()}
                  </Text>
                  <Text className="text-gray-900 text-lg font-bold leading-6">
                    {item.tourData?.name_tour || "Unknown Tour"}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${isPaid ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                  <Text className={`text-[10px] font-black uppercase ${isPaid ? 'text-emerald-700' : 'text-orange-700'}`}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mb-4">
                <Ionicons name="location" size={14} color="#3b82f6" />
                <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                  {item.tourData?.location_tour || "No Location Specified"}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pt-4 border-t border-gray-50">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <Ionicons name="person" size={16} color="#6b7280" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-gray-400 text-[10px]">Customer ID</Text>
                    <Text className="text-gray-700 font-bold text-xs">{item.userId?.slice(0, 10)}...</Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="text-gray-400 text-[10px]">{date.toLocaleDateString('en-US')}</Text>
                  <Text className="text-blue-600 text-xl font-black">${item.amount?.toLocaleString() || 0}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="file-tray-outline" size={60} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-lg font-medium">No records found</Text>
          </View>
        }
      />
    </View>
  );
};

export default AdminBookingManager;