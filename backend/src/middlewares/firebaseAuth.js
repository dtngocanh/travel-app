import { admin } from "../db/firebase.js"; // dùng import + .js

const firebaseAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Thiếu token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Firebase Auth error:", error);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
// Middleware kiểm tra quyền truy cập
export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực người dùng" });
    }

    const userRole = req.user.role || "customer"; // mặc định là customer nếu không có role

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    next();
  };
};

export default firebaseAuth; // export default chuẩn ES Module
