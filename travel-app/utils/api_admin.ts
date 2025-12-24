import axios from "axios";
import { auth } from "./firebase";
import { AddTourData, FileObject, TourDetail } from "./types";

const API_URL = "http://172.26.6.176:5001/api";

// Lấy token hợp lệ mới nhất từ Firebase
const getValidToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User chưa login");

  // forceRefresh = true đảm bảo token luôn hợp lệ
  const idToken = await user.getIdToken(true);
  return idToken;
};
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

export const addTourService = async (data: AddTourData) => {
  const token = await getValidToken(); // ✅ token

  const formData = new FormData();

  // --- 1. Main tour fields ---
  formData.append("name_tour", data.name_tour || "");
  formData.append("price_tour", String(data.price_tour || 0));
  formData.append("duration_tour", data.duration_tour || "");
  formData.append("location_tour", data.location_tour || "");

  // --- 2. Main tour image ---
  if (data.image_tour) {
    if (typeof data.image_tour !== "string") {
      formData.append("image_tour", data.image_tour as any); // File / Blob (Web)
    } else {
      formData.append("image_tour", data.image_tour); // uri string (Mobile)
    }
  }

  // --- 3. Details ---
  const details = data.details || [];
  details.forEach((d, i) => {
    formData.append(`details[${i}][itinerary_desc]`, d.itinerary_desc || "");
    formData.append(`details[${i}][itinerary_accommodation]`, d.itinerary_accommodation || "");

    if (d.itinerary_image) {
      if (typeof d.itinerary_image !== "string") {
        formData.append(`details[${i}][itinerary_image]`, d.itinerary_image as any);
      } else {
        formData.append(`details[${i}][itinerary_image]`, d.itinerary_image);
      }
    }

    formData.append(`details[${i}][operator_name]`, d.operator_name || "Explore!");
    formData.append(`details[${i}][tour_style_desc]`, d.tour_style_desc || "Discovery");
    formData.append(`details[${i}][guide_type_desc]`, d.guide_type_desc || "Local Guides");
    formData.append(`details[${i}][intensity_desc]`, d.intensity_desc || "Challenging");
    formData.append(`details[${i}][language]`, d.language || "English, French");
    formData.append(`details[${i}][group_size]`, d.group_size || "1-16 people");
    formData.append(`details[${i}][age_range]`, d.age_range || "Min 12+");
  });

  // --- 4. Axios POST ---
  const res = await axios.post(`${API_URL}/tours/add-tour`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const deleteTourService = async (id: string) => {
  try {
    const token = await getValidToken();
    console.log("Deleting tour:", id, "Token:", token);

    const res = await axios.delete(`${API_URL}/tours/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    console.log("Delete tour failed:", err.response?.data || err.message);
    throw err;
  }
};


export const updateTourService = async (
  tourId: string,
  tourData: AddTourData | any, // Nhận Object thô (chưa stringify)
  files: (FileObject & { fieldname: string })[] // Mảng file có fieldname
) => {
  const token = await getValidToken();
  const formData = new FormData();

  // 1. Chuyển Object dữ liệu thành chuỗi JSON và gán vào field 'data'
  // Backend sẽ parse field này ra để lấy thông tin text
  formData.append("data", JSON.stringify(tourData));

  // 2. Append từng file vào FormData
  // fieldname ở đây sẽ là 'image_tour' hoặc 'itinerary_image_0', 'itinerary_image_1'...
  files.forEach((file) => {
    formData.append(file.fieldname, {
      uri: file.uri,
      name: file.name || `upload-${Date.now()}.jpg`,
      type: file.type || "image/jpeg",
    } as any); // 'as any' để tránh lỗi Type của React Native với FormData
  });

  // 3. Gửi request PUT
  const res = await axios.put(`${API_URL}/tours/update/${tourId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Lấy chi tiết đầy đủ của 1 tour (bao gồm cả ngày chi tiết)
export const getTourDetailService = async (tourId: string) => {
  const token = await getValidToken();
  // Gọi vào cái API GetById mà mình đã sửa ở Backend
  const res = await axios.get(`${API_URL}/tours/${tourId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Backend trả về: { success: true, data: { ... } }
  return res.data.data;
};

