import express from "express";
import {getTripdetailbyTourId
} from "../controller/tripController.js";
const tripsRouter = express.Router();

tripsRouter.get("/byTour/:tourId", getTripdetailbyTourId);
export default tripsRouter;