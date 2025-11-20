import "dotenv/config";
import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import toursRoutes from "./routes/toursRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";

const app = express();
const PORT = ENV.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tours", toursRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Firebase Backend is running!");
});

app.listen(PORT,  () => {
  console.log(` Server đang chạy tại ${PORT}`);
});

// "0.0.0.0",
