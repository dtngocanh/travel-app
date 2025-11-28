// services/tourService.ts
import { 
  collection, query, orderBy, limit, onSnapshot, deleteDoc, doc, QuerySnapshot, DocumentData, Firestore, Unsubscribe 
} from "firebase/firestore";
import { db } from "../../utils/firebase"; // Firestore client

export interface Tour {
  id: string;         // Firestore doc.id
  id_tour: number;    // id tour trong Firestore
  name_tour: string;
  price_tour: number;
  duration_tour: string;
  reviews_tour: number;
  image_tour?: string;   // link Cloudinary
  location_tour: string; // ← thêm trường location
  created_at: string;
}


type Callback = (tours: Tour[]) => void;

/** Lấy realtime 10 tour mới nhất */
export const getLatestToursService = (limitNum: number = 10, callback: Callback): Unsubscribe => {
  const toursRef = collection(db, "tours");
  const q = query(toursRef, orderBy("created_at", "desc"), limit(limitNum));

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const list: Tour[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Tour));
    callback(list);
  });

  return unsubscribe;
};

// /** Xóa tour theo doc.id */
// export const deleteTourService = async (id: string) => {
//   const tourRef = doc(db, "tours", id);
//   await deleteDoc(tourRef);
// };
