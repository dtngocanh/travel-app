import express from "express";
import firebaseAuth, { authorizeRole } from "../middlewares/firebaseAuth.js";
import { getProfile, adminOnly, checkOrCreateUser, getProfileController, updateProfile,getAllUsersController, deleteUserController, updateUserRoleController, createUserController } from "../controllers/auth/userController.js";

const userRouter = express.Router();

userRouter.get("/profile", firebaseAuth, getProfile);
userRouter.get("/admin-only", firebaseAuth, adminOnly);
userRouter.post("/check-or-create", checkOrCreateUser)
// Lấy profile của user đang login
userRouter.get("/profile-person", firebaseAuth,  getProfileController);

// Cập nhật profile
userRouter.put("/profile-person", firebaseAuth,  updateProfile);
// Lấy toàn nộ listUser 
userRouter.get("/view-users", firebaseAuth, authorizeRole(['admin']), getAllUsersController);
// update role
userRouter.put("/update-role",firebaseAuth, authorizeRole(["admin"]),updateUserRoleController);

// Xóa 1 user (Admin)
userRouter.delete("/delete-user", firebaseAuth, authorizeRole(['admin']), deleteUserController)
userRouter.post("/create-user", firebaseAuth, authorizeRole(['admin']), createUserController)
export default userRouter;
