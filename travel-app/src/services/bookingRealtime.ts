import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const listenBookingsRealtime = (
  callback: (bookings: any[]) => void
) => {
  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
