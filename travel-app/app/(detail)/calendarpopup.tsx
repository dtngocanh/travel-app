import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

interface CalendarPopupProps {
  visible: boolean;
  onClose: () => void;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ visible, onClose }) => {
  const [date, setDate] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const router = useRouter();

  // Animation khi open/close
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.5, // overlay mờ
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      onClose(); // user nhấn Cancel
      return;
    }

    if (selectedDate) {
      setDate(selectedDate);

      // Android: picker chỉ hiện 1 lần
      if (Platform.OS === "android") {
        onClose();
        Alert.alert("Success", "You have successfully selected a schedule!");
        router.push(`/booking?date=${selectedDate.toISOString()}`);
      }
    }

    // iOS: nhấn Done
    if (Platform.OS === "ios" && event.type === "set") {
      onClose();
      Alert.alert("Success", "Bạn đã chọn lịch thành công!");
      router.push(`/booking?date=${selectedDate?.toISOString()}`);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Overlay mờ */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Popup slide lên */}
      <Animated.View
        style={[
          styles.popup,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={onChange}
        />
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  popup: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default CalendarPopup;
