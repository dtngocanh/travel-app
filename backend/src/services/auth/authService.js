import { admin } from "../../db/firebase.js"; // import ES Module

// admin.auth().getUserByEmail("testuser@example.com")
//   .then(user => console.log("✅ Kết nối Auth OK:", user.uid))
//   .catch(err => console.error("❌ Lỗi kết nối Auth:", err));


export const registerUser = async (email, password, role = "customer") => {
  try {
    const userRecord = await admin.auth().createUser({ email, password });

    // Gán role mặc định nếu không truyền
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    return { uid: userRecord.uid, email, role };
    
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error?.message || error);
    throw error; // hoặc có thể trả về một lỗi tùy chỉnh nếu muốn
    
  }
 
};

export const getAllUsers = async () => {
  const listUsers = await admin.auth().listUsers();
  return listUsers.users.map(u => ({
    uid: u.uid,
    email: u.email,
    role: u.customClaims?.role || "customer",
  }));
};
