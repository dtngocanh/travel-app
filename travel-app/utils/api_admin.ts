import axios from "axios";
import { auth } from "./firebase";

const API_URL = "http://192.168.1.228:5001/api";

// Lấy token hợp lệ mới nhất từ Firebase
const getValidToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User chưa login");

  // forceRefresh = true đảm bảo token luôn hợp lệ
  const idToken = await user.getIdToken(true);
  return idToken;
};

// Lấy danh sách user (chỉ admin)
export const getUserList = async () => {
  try {
    const token = await getValidToken();
    return axios.get(`${API_URL}/auth/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};
