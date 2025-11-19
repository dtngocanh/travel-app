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

// async function addTour(req, res) {
//   try {
//     const {
//       name_tour,
//       duration_tour,
//       location_tour,
//       price_tour,
//       reviews_tour,
//       image_tour
//     } = req.body;

//     const docRef = await db.collection("tours").add({
//       name_tour,
//       duration_tour,
//       location_tour,
//       price_tour,
//       reviews_tour,
//       image_tour
//     });

//     res.status(200).json({ message: "Thêm thành công tour.", id: docRef.id });
//   } catch (error) {
//     console.log("Lỗi thêm tour:", error);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// }

// async function updateTour(req, res) {
//   try {
//     const { id_tour } = req.params;
//     const data = req.body;

//     const docRef = db.collection("tours").doc(id_tour);
//     await docRef.update(data);

//     res.status(200).json({ message: "Cập nhật thành công tour." });
//   } catch (error) {
//     console.log("Lỗi update tour:", error);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// }

// async function deleteTour(req, res) {
//   try {
//     const { id_tour } = req.params;

//     await db.collection("tours").doc(id_tour).delete();

//     res.status(200).json({ message: "Đã xóa tour." });
//   } catch (error) {
//     console.log("Lỗi xóa tour:", error);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// }

export { getAllTours };
