import fs from "fs";
import { db } from "./firebase.js";

const tours = JSON.parse(fs.readFileSync("src/db/tours.json", "utf8"));
const tourDetails = JSON.parse(fs.readFileSync("src/db/tours_details.json", "utf8"));

async function importData() {
  const toursRef = db.collection("tours");

  for (const tour of tours) {
    if (!tour.id_tour) {
      console.warn("Bỏ qua vì thiếu id_tour:", tour);
      continue;
    }

    const tourDocRef = toursRef.doc(tour.id_tour.toString());
    await tourDocRef.set(tour);
    console.log(`Imported tour: ${tour.id_tour}`);

    const detailsForTour = tourDetails.filter(
      (detail) => detail.id_tour === tour.id_tour
    );

    for (const detail of detailsForTour) {
      const detailId = detail.id_detail || db.collection("tmp").doc().id; 
      await tourDocRef.collection("tours_details").doc(detailId).set(detail);
    }
  }

  console.log("Import completed!");
}

importData().catch((err) => console.error("Import failed:", err));

