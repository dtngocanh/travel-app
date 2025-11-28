import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ==========================================
// 1. CẤU HÌNH CLOUDINARY (QUAN TRỌNG NHẤT)
// ==========================================

// Lấy đường dẫn tuyệt đối đến file .env (Để tránh lỗi không tìm thấy file)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env"); 

// Nạp biến môi trường
dotenv.config({ path: envPath });

// Kiểm tra xem đã đọc được Key chưa (Debug)
if (!process.env.CLOUDINARY_API_KEY) {
  console.error(" LỖI: Không tìm thấy CLOUDINARY_API_KEY trong .env");
  console.error(" Đường dẫn đang tìm:", envPath);
}

// Cấu hình SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 2. HÀM UPLOAD (LOGIC CỦA BẠN ĐÃ FIX)
// ==========================================

/**
 * Upload file/image lên Cloudinary
 * @param {string|object} file - string (uri/base64) hoặc Buffer object
 * @param {string} publicId - tên file trên Cloudinary
 * @returns {Promise<string>} - trả về URL file đã upload
 */
export const uploadImageFromUri = async (file, publicId) => {
  return new Promise((resolve, reject) => {
    
    // === TRƯỜNG HỢP 1: Nếu là String (Base64 hoặc URL ảnh có sẵn) ===
    if (typeof file === "string") {
      cloudinary.uploader.upload(
        file,
        {
          folder: "travel_app_tours", // Tên folder trên Cloudinary
          public_id: publicId,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) {
            console.error("Cloudinary String Upload Error:", err);
            return reject(err);
          }
          resolve(result.secure_url);
        }
      );
      return;
    }

    // === TRƯỜNG HỢP 2: Nếu là Buffer (File từ Web/Mobile gửi lên qua Multer) ===
    // (Xử lý cả Buffer của Node và ArrayBuffer)
    let buffer;
    if (Buffer.isBuffer(file)) {
        buffer = file; // Nếu truyền thẳng buffer
    } else if (file && file.buffer) {
        buffer = file.buffer; // Nếu truyền object Multer { fieldname, buffer... }
    }

    if (buffer) {
      // Stream upload (Chuẩn cho Buffer)
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "travel_app_tours",
          public_id: publicId,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) {
            console.error("Cloudinary Buffer Upload Error:", err);
            return reject(err);
          }
          resolve(result.secure_url);
        }
      );

      // Đẩy buffer vào stream
      stream.end(buffer);
      return;
    }

    // === TRƯỜNG HỢP 3: Lỗi định dạng ===
    console.error("Invalid file format:", file);
    reject(new Error("Invalid file format passed to uploadImageFromUri(). Expected String or Buffer."));
  });
};