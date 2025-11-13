import express from "express";
import firebaseAuth from "../middlewares/firebaseAuth.js";
import { getProfile, adminOnly } from "../controller/auth/userController.js";

const userRouter = express.Router();

userRouter.get("/profile", firebaseAuth, getProfile);
userRouter.get("/admin-only", firebaseAuth, adminOnly);

export default userRouter;
