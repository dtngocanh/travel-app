import { db } from "../../utils/firebase"; // Firestore client
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// Gọi callback mỗi khi collection 'users' thay đổi
export const listenUsers = (callback: (users: any[]) => void) => {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    callback(users);
  });

  return unsubscribe; 
};
