import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./db/firebase.js";

const app = express();
const PORT = ENV.PORT;

// Middleware parse JSON
app.use(express.json());

// Route đọc dữ liệu từ collection 'users'
app.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Failed to get users", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
