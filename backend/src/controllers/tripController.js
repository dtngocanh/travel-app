import { db } from "../db/firebase.js";

// sắp xếp lịch trình theo ngày từ intro đến day 1 đến day n
// Regex để trích xuất số từ chuỗi "Day X"
const DAY_REGEX = /Day\s*(\d+)/i; 

// Hàm sắp xếp tùy chỉnh
const customSortItineraries = (tripItineraries) => {
    return tripItineraries.sort((a, b) => {
        const dayA = a.itinerary_day;
        const dayB = b.itinerary_day;
        
        // --- 1. ƯU TIÊN TUYỆT ĐỐI: "Intro" phải đứng đầu ---
        if (dayA === 'Intro') return -1; // Đẩy 'Intro' (A) lên trước
        if (dayB === 'Intro') return 1;  // Đẩy 'Intro' (B) lên trước
        
        // --- 2. SẮP XẾP THEO SỐ NGÀY ---
        
        // Trích xuất số ngày từ chuỗi (Ví dụ: "Day 5" -> 5)
        const matchA = dayA?.match(DAY_REGEX);
        const matchB = dayB?.match(DAY_REGEX);
        
        // Chuyển đổi thành số nguyên. Dùng 999 (hoặc Infinity) nếu không tìm thấy số
        const numA = matchA ? parseInt(matchA[1], 10) : 999; 
        const numB = matchB ? parseInt(matchB[1], 10) : 999;
        
        return numA - numB; // Sắp xếp tăng dần (1, 2, 3, ...)
    });
};



async function getTripdetailbyTourId(req, res) {
    console.log("--- Bắt đầu xử lý getTripdetailbyTourId ---");
  try {
    // 1. Lấy ID tour từ tham số URL
      const tourId = req.params.tourId;
    
    // Tạo truy vấn: Tìm tất cả tài liệu trong collection 'trip' 
    //    mà trường 'id_tour' của chúng khớp với tourId
    // const tripsQuery = query(
    //   collection(db, "trip"),
    //   where("id_tour", "==", tourId) //  Điều kiện liên kết Tour ID
    // );

   const querySnapshot = await db.collection("tours").doc(tourId)
    .collection("tours_details").get();
    // const querySnapshot = await getDocs(tripsQuery);
    // const querySnapshot = await tripsQuery.get();
    // if (querySnapshot.empty) {
    //   // Trả về mảng rỗng nếu không có lịch trình nào
    //     console.log(`Không tìm thấy lịch trình nào cho Tour ID ${tourId}`);
    //   return res.json([]); 
    // }
    const tripItineraries = querySnapshot.docs.map(doc => ({ 
            id_trip: doc.id, 
            id_tour_db: doc.data().id_tour, // Lấy ID tour từ DB để kiểm tra
            itinerary_day: doc.data().itinerary_day,
            ...doc.data() 
        }));
        const sortedItineraries = customSortItineraries(tripItineraries);
    console.log(`Số lượng lịch trình tìm thấy cho Tour ID ${tourId}: ${querySnapshot.docs.length}`);
  return res.status(200).json(tripItineraries, sortedItineraries);
    
  } catch (error) {
    console.log("Lỗi lấy chi tiết trip: ", error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết trip." });
  }
}


export { getTripdetailbyTourId };
