import {db, admin} from "../../db/firebase.js"
// Lấy dl cơ bản thì firebase Auth
export const getProfileInfo = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    role: user.role || "customer",
  };
};
// Kiểm tra quyền admin
export const checkAdminAccess = (user) => {
  if (user.role !== "admin") {
    throw new Error("Bạn không có quyền truy cập (admin-only).");
  }
  return { message: "Xin chào admin, bạn có quyền truy cập!" };
};
// BÊN CUSTOMER
// Tạo user firebase nếu chưa tồn tại
export const checkOrCreateUserService = async (uid, email) => {
  const userRef = db.collection("users").doc(uid);
  const docSnap = await userRef.get();

  if (!docSnap.exists) {
    await userRef.set({
      email,
      role: "customer",   
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      country: "",
      avatar: "",
      createdAt: new Date(),
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role: "customer" });

    return { created: true };
  }

  return { created: false };
};

//  Lấy profile đầy đủ từ FireStore (cus)
export const getProfilePerService = async (uid) => {
  const userRef = db.collection("users").doc(uid);
  const docSnap = await userRef.get();

  if (!docSnap.exists) {
    throw new Error("User not found");
  }

  return { uid, ...docSnap.data() };
};
// Update Profile (cus)

export const updateProfileService = async (uid, data) => {
  const userRef = db.collection("users").doc(uid);

  // Cập nhật dữ liệu
  await userRef.update(data);

  // Lấy lại document sau khi update
  const updatedDoc = await userRef.get();

  return { uid, ...updatedDoc.data() };
};
//  Lấy danh sách tất cả user (Auth + Firestore)
export const getAllUsersService = async () => {
  const authUsers = await admin.auth().listUsers();

  const result = [];

  for (const user of authUsers.users) {
    const uid = user.uid;

    // Lấy Firestore info
    const userRef = db.collection("users").doc(uid);
    const docSnap = await userRef.get();

    result.push({
      uid,
      email: user.email,
      role: user.customClaims?.role || "customer",
      ...(docSnap.exists ? docSnap.data() : {}),
    });
  }

  return result;
};
// update role user
export const updateUserRoleService = async (uid, role) => {
  if (!uid || !role) {
    throw new Error("Missing uid or role");
  }

  //  Update Firestore
  await db.collection("users").doc(uid).update({ role });

  //  Update Firebase Auth custom claims
  await admin.auth().setCustomUserClaims(uid, { role });

  return { success: true };
};
// Xóa user admin
export const deleteUserService = async (uid) => {
  try {
    // 1. Xóa trong Firestore nếu có
    const userRef = db.collection("users").doc(uid);
    const docSnap = await userRef.get();
    if (docSnap.exists) {
      await userRef.delete();
    }

    // 2. Xóa trong Firebase Authentication
    await admin.auth().deleteUser(uid);

    return { success: true, message: "User đã được xóa" };
  } catch (error) {
    console.error("Lỗi khi xóa user:", error);
    throw new Error(error.message || "Xóa user thất bại");
  }
};
// Tạo user với admin
export const createUserService = async ({ email, password, role, firstName = "", lastName = "", phone = "", city = "", country = "" }) => {
  try {
    // 1. Tạo user trong Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // 2. Gán role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // 3. Lưu thông tin vào Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
      firstName,
      lastName,
      phone,
      city,
      country,
      avatar: "",
      createdAt: new Date(),
    });

    return userRecord;
  } catch (err) {
    console.error("Create user service error:", err);
    throw err;
  }
};
