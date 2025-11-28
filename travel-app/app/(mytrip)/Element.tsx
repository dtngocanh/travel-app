import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons'; 

// Định nghĩa props để khớp với cách bạn truyền từ Tabscreen
interface TripCardProps {
  dates: string;
  origin: string;
  destination: string;
  travelers: string;
  duration: string;
}

const PRIMARY_COLOR = '#FF6600'; // Màu cam cho "Modify trip"
const TEXT_COLOR = '#333';
const GRAY_COLOR = '#777';

const TripCard: React.FC<TripCardProps> = ({ 
  dates, 
  origin, 
  destination, 
  travelers, 
  duration 
}) => {
  return (
    <View style={styles.cardContainer}>
      
      {/* --- PHẦN TRÊN: NGÀY THÁNG --- */}
      <Text style={styles.dateText}>{dates}</Text>

      <View style={styles.mainContent}>
        
        {/* --- DÒNG 1: ĐIỂM ĐI, ĐIỂM ĐẾN VÀ NÚT SỬA --- */}
        <View style={styles.routeSection}>
          <View style={styles.routeDetails}>
            
            {/* Icon Quả địa cầu/Tìm kiếm */}
            <Feather name="globe" size={24} color={GRAY_COLOR} style={{ marginRight: 10 }} />
            
            <Text style={styles.cityText}>{origin}</Text>
            
            {/* Mũi tên */}
            <MaterialIcons name="arrow-forward" size={24} color={TEXT_COLOR} style={{ marginHorizontal: 10 }} />
            
            <Text style={styles.cityText}>{destination}</Text>
          </View>

          {/* Nút Modify Trip */}
          <TouchableOpacity>
            <Text style={styles.modifyText}>Modify trip</Text>
          </TouchableOpacity>
        </View>

        {/* --- DÒNG 2: THÔNG TIN KHÁCH --- */}
        <View style={styles.infoSection}>
          <Text style={styles.personText}>{travelers}</Text>
        </View>

        {/* --- DÒNG 3: THÔNG TIN CHUYẾN ĐI VÀ CHIA SẺ --- */}
        <View style={styles.bottomSection}>
          <Text style={styles.daysText}>{duration}</Text>
          
          {/* Icon Chia sẻ */}
          <TouchableOpacity>
            <Feather name="share-2" size={20} color={GRAY_COLOR} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: TEXT_COLOR,
  },
  mainContent: {},
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  modifyText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  infoSection: {
    marginBottom: 5,
    paddingLeft: 34, 
  },
  personText: {
    fontSize: 16,
    color: GRAY_COLOR,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 34, 
  },
  daysText: {
    fontSize: 14,
    color: GRAY_COLOR,
  },
});

export default TripCard;