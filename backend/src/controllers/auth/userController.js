import * as userService from "../../services/auth/userService.js";

export const getProfile = async (req, res) => {
  try {
    const profile = userService.getProfileInfo(req.user);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminOnly = async (req, res) => {
  try {
    const result = userService.checkAdminAccess(req.user);
    res.json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
// Kiểm tra có hay là chưa thì sẽ tạo thông tin user lưu vào firebase
export const checkOrCreateUser = async (req, res) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: "Missing uid or email" });
  }

  try {
    const result = await userService.checkOrCreateUserService(uid, email);

    res.json({
      created: result.created,
      message: result.created
        ? "Profile created"
        : "Profile already exists",
    });
  } catch (error) {
    console.error("checkOrCreateUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy profile ở customer
export const getProfileController = async (req, res) => {
  try {
    const profile = await userService.getProfilePerService(req.user.uid);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Cập nhật profile ở customer
export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await userService.updateProfileService(req.user.uid, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Lấy toàn bộ user
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAllUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// update role
export const updateUserRoleController = async (req, res) => {
  try {
    const { uid, role } = req.body;

    const result = await userService.updateUserRoleService(uid, role);

    res.json({
      success: true,
      message: "Role updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Role update error:", err);
    res.status(500).json({ message: err.message || "Failed to update role" });
  }
};
// Xóa user
export const deleteUserController = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: "Thiếu uid" });
    }

    const result = await userService.deleteUserService(uid);
    return res.json(result);
  } catch (error) {
    console.error("Lỗi controller xóa user:", error);
    return res.status(500).json({ success: false, message: error.message || "Xóa user thất bại" });
  }
};
// admin tạo user
export const createUserController = async (req, res) => {
  try {
    const { email, role, firstName, lastName, phone, city, country } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    // Password tạm thời (random 8 ký tự)
    const tempPassword = Math.random().toString(36).slice(-8);

    const user = await userService.createUserService({
      email,
      password: tempPassword,
      role,
      firstName,
      lastName,
      phone,
      city,
      country,
    });

    // Trả về info + temp password
    res.json({
      success: true,
      uid: user.uid,
      email: user.email,
      role,
      tempPassword,
    });
  } catch (err) {
    console.error("Create user controller error:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
};
