import express from "express";
import { ENV } from "./config/env.js";
import toursRoutes from "./routes/tours.route.js";

const app = express();
const PORT = ENV.PORT;

// Middleware parse JSON
app.use(express.json());

app.use("/tours", toursRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
