import express from "express";
import {
  getAllTours
} from "../controller/toursController.js";

const router = express.Router();

router.get("/", getAllTours);

export default router;
