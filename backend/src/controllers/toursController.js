import { db } from "../db/firebase.js";
import {
  getTourByIdService,
  addTourService,
  deleteTourService,
  updateTourService
} from "../services/tourService.js";

async function getAllTours(req, res) {
  try {
    const snapshot = await db.collection("tours").get();
    const tours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tours);
  } catch (error) {
    console.log("Lỗi lấy tours: ", error);
    res.status(500).json({ message: "Lỗi server khi lấy tours." });
  }
}

export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Missing tour ID" });

    const tour = await getTourByIdService(id);
    
    return res.status(200).json({ 
        success: true, 
        data: tour 
    });
  } catch (err) {
    console.error("Lỗi lấy chi tiết tour:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. THÊM TOUR MỚI
export const addTourController = async (req, res) => {
  try {
    // Truyền nguyên object req để service tự tách body và files
    // Hoặc truyền object { body: req.body, files: req.files } cho rõ ràng
    const result = await addTourService({ 
        body: req.body, 
        files: req.files || [] 
    });
    
    return res.status(200).json({ 
        success: true, 
        message: "Tour created successfully", 
        data: result 
    });
  } catch (err) {
    console.error("Add tour error >>>", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. XÓA TOUR
export const deleteTourController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Missing tour ID" });

    const result = await deleteTourService(id);

    return res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Delete tour error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Delete tour failed",
    });
  }
};

// 5. CẬP NHẬT TOUR
export const updateTourController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Missing tour ID" });

    // Gọi service với 3 tham số rời (để khớp với logic ...args của service updateTourService)
    // Hoặc truyền 1 object, service của bạn đã xử lý được cả 2 trường hợp này rồi.
    const result = await updateTourService(
      id,                  // docId
      req.body,            // body (chứa field 'data' string JSON)
      req.files || []      // files array
    );

    return res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: result, // Dữ liệu mới nhất (đã bao gồm details) để frontend update realtime
    });
  } catch (err) {
    console.error("Update tour error:", err);
    return res.status(400).json({ success: false, error: err.message });
  }
};


export { getAllTours };
