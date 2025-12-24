import express from "express";
import { upload } from "../middlewares/upload.js";
import firebaseAuth, { authorizeRole } from "../middlewares/firebaseAuth.js";
import {
  getAllTours, 
  getTourById, // <--- Import hàm mới
  addTourController, 
  deleteTourController, 
  updateTourController
} from "../controllers/toursController.js";

const router = express.Router();

// Public routes
router.get("/", getAllTours);
router.get("/:id", getTourById); // <--- ROUTE QUAN TRỌNG CÒN THIẾU

// Admin routes
router.post("/add-tour", firebaseAuth, authorizeRole(["admin"]), upload.any(), addTourController);
router.delete("/:id",  firebaseAuth, authorizeRole(["admin"]), deleteTourController); 
router.put("/update/:id",  firebaseAuth, authorizeRole(["admin"]), upload.any(), updateTourController); 

export default router;