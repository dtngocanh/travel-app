import { db } from "../db/firebase.js";

async function getAllTours(req, res) {
  try {
    const snapshot = await db.collection("tours").get();
    const tours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tours);
  } catch (error) {
    console.log("Lỗi lấy tours: ", error);
    res.status(500).json({ message: "Lỗi server khi lấy tours." });
  }
}


export { getAllTours };
