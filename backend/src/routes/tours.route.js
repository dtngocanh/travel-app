import express from "express";
import {
  getAllTours
} from "../controllers/tours.controller.js";

const router = express.Router();

router.get("/", getAllTours);

export default router;
