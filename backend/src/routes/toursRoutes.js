import express from "express";
import {
  getAllTours
} from "../controllers/toursController.js";

const router = express.Router();

router.get("/", getAllTours);

export default router;
