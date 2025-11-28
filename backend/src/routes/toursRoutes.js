import express from "express";
import {
  getAllTours, getToursbyId
} from "../controller/toursController.js";

const router = express.Router();

router.get("/", getAllTours);
router.get("/:id", getToursbyId);

export default router;
