import "dotenv/config";
import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import toursRoutes from "./routes/toursRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
<<<<<<< HEAD
import tripsRouter from './routes/tripsRoute.js';
=======
import paymentRoutes from "./routes/paymentRoutes.js";
>>>>>>> feab1b1ab419a5589c1188d1a46be380ab9686ed

const app = express();
const PORT = ENV.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/tours", toursRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
<<<<<<< HEAD
app.use('/api/trips', tripsRouter);

=======
app.use("/api", paymentRoutes); 
>>>>>>> feab1b1ab419a5589c1188d1a46be380ab9686ed

app.get("/", (req, res) => {
  res.send("Firebase Backend is running!");
});

app.listen(PORT,  () => {
  console.log(` Server running on ${PORT}`);
});

