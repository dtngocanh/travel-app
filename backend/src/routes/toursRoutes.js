import express from "express";
import { upload } from "../middlewares/upload.js";
import firebaseAuth, { authorizeRole } from "../middlewares/firebaseAuth.js";
import {
<<<<<<< HEAD
  getAllTours, getToursbyId
} from "../controller/toursController.js";
=======
  getAllTours, 
  getTourById, // <--- Import hàm mới
  addTourController, 
  deleteTourController, 
  updateTourController
} from "../controllers/toursController.js";
>>>>>>> feab1b1ab419a5589c1188d1a46be380ab9686ed

const router = express.Router();

// Public routes
router.get("/", getAllTours);
<<<<<<< HEAD
router.get("/:id", getToursbyId);
=======
router.get("/:id", getTourById); // <--- ROUTE QUAN TRỌNG CÒN THIẾU
>>>>>>> feab1b1ab419a5589c1188d1a46be380ab9686ed

// Admin routes
router.post("/add-tour", firebaseAuth, authorizeRole(["admin"]), upload.any(), addTourController);
router.delete("/:id",  firebaseAuth, authorizeRole(["admin"]), deleteTourController); 
router.put("/update/:id",  firebaseAuth, authorizeRole(["admin"]), upload.any(), updateTourController); 

export default router;