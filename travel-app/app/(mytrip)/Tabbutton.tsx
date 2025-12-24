import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Triptabs } from '../(customer)/mytrip'; // Import Triptabs từ file index.tsx (Tabscreen)

// Định nghĩa kiểu dữ liệu cho nút (để khớp với TabbutonType trong Tabscreen)
export interface TabbutonType {
  title: string;
}

interface TabButtonProps {
  button: TabbutonType[];
  selecttab: Triptabs;
  setSelecttab: (tab: Triptabs) => void;
}

const TabButon: React.FC<TabButtonProps> = ({ button, selecttab, setSelecttab }) => {
  return (
    <View style={styles.tabContainer}>
      {button.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            // Áp dụng style active nếu index khớp với selecttab (Enum)
            selecttab === index && styles.tabActive,
          ]}
          // Khi nhấn, setSelecttab bằng index của nút (vì Enum Triptabs = 0, 1, 2)
          onPress={() => setSelecttab(index)}
        >
          <Text 
            style={[
              styles.tabText,
              selecttab === index && styles.tabTextActive,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#007bff', // Màu xanh dương hoặc màu theme
  },
  tabText: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default TabButon;