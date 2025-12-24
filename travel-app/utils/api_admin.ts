import axios from "axios";
import { auth } from "./firebase";

const API_URL = "http://172.26.1.235:5001/api";

// Lấy token hợp lệ mới nhất từ Firebase
const getValidToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User chưa login");

  // forceRefresh = true đảm bảo token luôn hợp lệ
  const idToken = await user.getIdToken(true);
  return idToken;
};

// Lấy danh sách user (chỉ admin)
// export const getUserList = async () => {
//   try {
//     const token = await getValidToken();
//     return axios.get(`${API_URL}/auth/list`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   } catch (error) {
//     throw error;
//   }
// };
export const getUserList = async () => {
  try {
    const token = await getValidToken();
    return axios.get(`${API_URL}/users/view-users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};
// Delete user
export const deleteUser = async (uid: string) => {
  try {
    const token = await getValidToken();

    const response = await axios.delete(`${API_URL}/users/delete-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { uid }, // Gửi UID trong body
    });

    return response.data;
  } catch (error: any) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw error;
  }
};
// create user admin 
export const createUser = async (email: string, role: "customer" | "admin") => {
  try {
    const token = await getValidToken();

    const response = await axios({
      method: "post",
      url: `${API_URL}/users/create-user`,
      headers: { Authorization: `Bearer ${token}` },
      data: { email, role },
    });

    return response.data; // { uid, email, role, tempPassword }
  } catch (error: any) {
    console.error("Create user error:", error.response?.data || error.message);
    throw error;
  }
};




