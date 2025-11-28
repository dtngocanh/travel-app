import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load biến môi trường trước khi config
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Kiểm tra
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);

export { cloudinary };
