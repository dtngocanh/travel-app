import React from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity, Platform } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons'; 

// Định nghĩa props để khớp với cách bạn truyền từ Tabscreen
interface TripCardProps {
  dates: string;
  nametour: string;
  imagetour: string;
  duration: string;
}

const PRIMARY_COLOR = '#FF6600'; // Màu cam cho "Modify trip"
const TEXT_COLOR = '#333';
const GRAY_COLOR = '#777';
const isWeb = Platform.OS === 'web';

const TripCard: React.FC<TripCardProps> = ({ 
  dates, 
  nametour, 
  imagetour, 
  duration 
}) => {
  return (
    <View style={[styles.cardContainer, isWeb && styles.cardContainerWeb]}>
      
      {/* --- PHẦN TRÊN: NGÀY THÁNG --- */}
      <Text style={styles.dateText}>Start going on {dates}</Text>

      {/* --- KHỐI CHI TIẾT CHÍNH (Ảnh + Văn bản) --- */}
      <View style={[styles.detailsWrapper, isWeb && styles.detailsWrapperWeb]}>
        
        {/* 1. KHUNG ẢNH */}
        <View style={isWeb ? styles.imageContainerWeb : styles.imageContainerMobile}>
          <Image
            source={{ uri: imagetour }}
            style={styles.imageStyle}
            resizeMode="cover"
          />
        </View>

        {/* 2. KHUNG VĂN BẢN (CHUYỂN ĐỘNG THEO ẢNH) */}
        <View style={styles.mainContent}>
          
          {/* DÒNG 1: TÊN TOUR và NÚT MODIFY */}
          <View style={styles.routeSection}>
            <View style={styles.routeDetails}>
              <Text style={styles.cityText} numberOfLines={2}>{nametour}</Text>
            </View>

            {/* Nút Modify Trip */}
            <TouchableOpacity>
              <Text style={styles.modifyText}>Modify trip</Text>
            </TouchableOpacity>
          </View>
          
          {/* DÒNG 2: THÔNG TIN DURATION & SHARE */}
          <View style={styles.bottomSection}>
            <Text style={styles.daysText}>{duration} trip</Text>
            
            <TouchableOpacity>
              <Feather name="share-2" size={20} color={GRAY_COLOR} />
            </TouchableOpacity>
          </View>

        </View>
        
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  // --- CONTAINER CHUNG ---
  cardContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
  },
  cardContainerWeb: {
    padding: 25,
    marginVertical: 10,
    minHeight: 180,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 15,
    color: TEXT_COLOR,
  },
  
  // --- LAYOUT DYNAMIC ---
  detailsWrapper: {
    // 🚨 MOBILE DEFAULT: Column (Ảnh trên, Text dưới)
    flexDirection: 'column', 
  },
  detailsWrapperWeb: {
    // 🚨 WEB LAYOUT: Row (Ảnh trái, Text phải)
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15, // Khoảng cách giữa ảnh và nội dung
  },
  
  // --- KHUNG ẢNH ---
  imageContainerMobile: {
    marginBottom: 15, // Khoảng cách dưới ảnh trên Mobile
  },
  imageContainerWeb: {
    width: '30%', // Ảnh chiếm 30% chiều rộng trên Web
    minWidth: 120,
  },
  imageStyle: {
    width: "100%", 
    height: 120, // Giảm chiều cao ảnh để phù hợp với card
    borderRadius: 8,
  },

  // --- KHUNG NỘI DUNG ---
  mainContent: {
    flex: 1, // Cho phép nội dung Text chiếm phần còn lại trên Web
  },
  
  // --- FLEXBOX CĂN CHỈNH NỘI DUNG (GIỮ NGUYÊN) ---
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeDetails: {
    flex: 1, 
    flexShrink: 1, 
    marginRight: 15, 
  },
  cityText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  modifyText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  daysText: {
    fontSize: 14,
    color: GRAY_COLOR,
  },
});

export default TripCard;