import multer from "multer";

const storage = multer.memoryStorage(); // lưu tạm file vào RAM

export const upload = multer({ storage });
