import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Định nghĩa kiểu dữ liệu 
interface TripDetails {
  operator_name: string;
  language: string; // Tên trường bạn đã sử dụng trong code
  tour_style_desc: string;
  intensity_desc: string;
  itinerary_accommodation: string | null;
  group_size: string;
  age_range: string;
}

interface TripDetailsContentProps {
    content: TripDetails;
}

// Danh sách các mục dữ liệu để lặp (7 mục)
const SPECIFICATIONS_FIELDS = [
    { label: "Operator", value: (c: TripDetails) => c.operator_name },
    { label: "Guided in", value: (c: TripDetails) => c.language },
    { label: "Tour Style", value: (c: TripDetails) => c.tour_style_desc },
    { label: "Intensity", value: (c: TripDetails) => c.intensity_desc },
    { label: "Accommodation", value: (c: TripDetails) => c.itinerary_accommodation },
    { label: "Group Size", value: (c: TripDetails) => c.group_size },
    { label: "Age Range", value: (c: TripDetails) => c.age_range },
];

const Specifications: React.FC<TripDetailsContentProps> = ({ content }) => {
    const isWeb = Platform.OS === "web";
    
    const renderRow = (label: string, value: string | null | undefined, isLastRow: boolean) =>{ 
        const rowStyle = !isLastRow && isWeb 
            ? styles.rowBorderweb 
            : null;
        
        return (
        <View 
            key={label}
            style={[
                styles.row, 
                rowStyle // Chỉ thêm border nếu không phải hàng cuối
            ]}
        //     className="flex-row justify-between items-start pb-2 mb-2"
        // >
        //     <Text className="text-base font-semibold text-gray-900 w-1/3">{label}</Text>
        //     <Text className="text-base text-gray-600 w-2/3 text-right">
        //         {value || 'N/A'}
        //     </Text>
        className="flex-row items-start pb-2 mb-2" 
        >
            {/* NHÃN (LABEL) */}
            <Text className="text-base font-semibold text-gray-900">
                {label}:
            </Text>
            
            {/* GIÁ TRỊ (VALUE) - Nằm ngay sau label */}
            <Text 
                className="text-base text-gray-600 ml-3"    // Khoảng cách nhỏ giữa label và value
                style={{ flexShrink: 1 }} // Cho phép văn bản giá trị bị cắt nếu quá dài
            >
                    {value || 'N/A'}
            </Text>
        </View>
    );}
    
    // Phân chia các mục thành hai cột
    // Cột 1: 4 mục đầu tiên; Cột 2: 3 mục còn lại
    const column1Data = SPECIFICATIONS_FIELDS.slice(0, 4);
    const column2Data = SPECIFICATIONS_FIELDS.slice(4);

    if (isWeb) {
        // --- WEB LAYOUT (2 CỘT) ---
        return (
            <View style={styles.cardContainer}>
                <View style={styles.twoColumnContainer}>
                    
                    {/* CỘT 1 (4 HÀNG) */}
                    <View style={styles.column}>
                        {column1Data.map((field, index) => 
                            renderRow(field.label, field.value(content), index === column1Data.length - 1)
                        )}
                    </View>

                    {/* CỘT 2 (3 HÀNG) */}
                    <View style={styles.column}>
                        {column2Data.map((field, index) => 
                            renderRow(field.label, field.value(content), index === column2Data.length - 1)
                        )}
                    </View>
                    
                </View>
            </View>
        );
    }
    
    // --- MOBILE LAYOUT (1 CỘT) ---
    return (
        <View style={styles.cardContainer}>
            {SPECIFICATIONS_FIELDS.map((field, index) => 
                renderRow(field.label, field.value(content), index === SPECIFICATIONS_FIELDS.length - 1)
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        backgroundColor: 'white',
        marginTop: 15,
        borderRadius: 8,
    },
    twoColumnContainer: {
        flexDirection: 'row',
        gap: 100, // Khoảng cách giữa hai cột
    },
    column: {
        flex: 1, // Mỗi cột chiếm 50% không gian
        minWidth: 0, // Cần thiết cho Flexbox trên web
    },
    row: {
        flexDirection: 'row',
        // justifyContent: 'space-between', // dữ liệu nằm ở cuối hàng
        alignItems: 'flex-start',
        paddingTop: 8,
        paddingBottom: 8,
    },
    rowBorderweb: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Màu viền nhẹ
    }
    // rowBordermob: {
    //     borderBottomWidth: 1,
    // }
});

export default Specifications;