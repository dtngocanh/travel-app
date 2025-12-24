import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Alert } from "react-native";

export const exportBookingsToCSV = async (bookings: any[]) => {
  if (!bookings || bookings.length === 0) {
    Alert.alert("Lỗi", "Không có dữ liệu để xuất");
    return;
  }

  // 1. Tạo nội dung CSV
  const header = "BookingID,TourName,Location,Price,Status,UserId,CreatedAt\n";
  const rows = bookings
    .map((b) => {
      const name = b.tourData?.name_tour?.replace(/,/g, "") || "N/A";
      const location = b.tourData?.location_tour?.replace(/,/g, "") || "N/A";
      let dateStr = "N/A";
      if (b.createdAt) {
        const date = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        dateStr = date.toLocaleString('vi-VN');
      }
      return [
        b.firestoreId || b.id, 
        `"${name}"`, 
        `"${location}"`, 
        b.amount || 0, 
        b.status, 
        b.userId, 
        `"${dateStr}"`
      ].join(",");
    })
    .join("\n");

  const csvContent = "\uFEFF" + header + rows;
  const fileName = `bookings_${Date.now()}.csv`;

  // --- XỬ LÝ CHO WEB ---
  if (Platform.OS === "web") {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    return;
  }

  // --- XỬ LÝ CHO MOBILE (DÙNG ÉP KIỂU ĐỂ SỬA LỖI PROPERTY) ---
  try {
    // Ép kiểu FileSystem sang 'any' để truy cập các thuộc tính bị TypeScript báo lỗi
    const fsAny = FileSystem as any;
    
    // Kiểm tra các thư mục khả dụng
    const directory = fsAny.cacheDirectory || fsAny.documentDirectory;
    
    if (!directory) {
      Alert.alert("Lỗi", "Không tìm thấy thư mục lưu trữ trên thiết bị.");
      return;
    }

    const fileUri = `${directory}${fileName}`;

    // Ghi file (Dùng string 'utf8' thay cho Enum)
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: "utf8" as any,
    });

    // Chia sẻ file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Xuất dữ liệu Booking",
        UTI: "public.comma-separated-values-text", 
      });
    } else {
      Alert.alert("Lỗi", "Tính năng chia sẻ không khả dụng trên thiết bị này.");
    }
  } catch (error: any) {
    console.error("Export Error:", error);
    Alert.alert("Lỗi hệ thống", error.message || "Không thể xuất file.");
  }
};