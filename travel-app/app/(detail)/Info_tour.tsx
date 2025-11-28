import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
// LƯU Ý: Không cần import từ 'react-native-reanimated' nữa
import { Feather } from '@expo/vector-icons'; 

interface TripDetails {
  operator_name: string;
  language: string; // Đã sửa từ 'language' sang 'languages'
  tour_style_desc: string;
  intensity_desc: string;
  itinerary_accommodation: string | null;
  group_size: string;
age_range: string;
}

// Định nghĩa props cho component này
interface TripDetailsContentProps {
    content: TripDetails;
}

const Specifications: React.FC<TripDetailsContentProps> = ({ content }) => {
    return (
        
        <View className="p-4 bg-white mt-4">
        
       
        <View className="flex-row justify-between items-start border-b border-gray-100 pb-2 mb-2">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Operator</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
                {content.operator_name || 'N/A'}
            </Text>
        </View>

        <View className="flex-row justify-between items-start border-b border-gray-100 pb-2 mb-2">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Guided in</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
                {content.language || 'N/A'} 
            </Text>
        </View>
        
       
        <View className="flex-row justify-between items-start border-b border-gray-100 pb-2 mb-2">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Tour Style</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
                {content.tour_style_desc || 'N/A'}
            </Text>
        </View>
        
      
        <View className="flex-row justify-between items-start border-b border-gray-100 pb-2 mb-2">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Intensity</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
                {content.intensity_desc || 'N/A'}
            </Text>
        </View>

        <View className="flex-row justify-between items-start border-b border-gray-100 pb-2 mb-2">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Accommodation</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
                {content.itinerary_accommodation || 'N/A'}
            </Text>
        </View>

        <View className="flex-row justify-between items-start border-b border-gray-100 pb-2 mb-2">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Group Size</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
               {content.group_size || 'N/A'}
            </Text>
        </View>

     
        <View className="flex-row justify-between items-start">
            <Text className="text-base font-semibold text-gray-900 w-1/3">Age Range</Text>
            <Text className="text-base text-gray-600 w-2/3 text-right">
                {content.age_range || 'N/A'}
            </Text>
        </View>
        
    </View>
    );
}
export default Specifications;