import * as authService from "../../services/auth/authService.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await authService.registerUser(email, password, role);
    res.status(201).json({
      message: "Tạo tài khoản thành công",
      user,
    });
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    res.status(400).json({ message: error.message });
  }
};


export const listUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách user" });
  }
};
