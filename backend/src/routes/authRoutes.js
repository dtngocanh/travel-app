import express from "express";
import { register, listUsers } from "../controllers/auth/authController.js";
import firebaseAuth, { authorizeRole } from "../middlewares/firebaseAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
// Danh sách user — chỉ admin mới xem được
authRouter.get("/list", firebaseAuth, authorizeRole(["admin"]), listUsers);


export default authRouter;
