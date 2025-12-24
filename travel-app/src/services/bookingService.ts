import { db } from "../../utils/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export const listenAdminSummary = (callback: (stats: any) => void) => {
  const bookingsRef = collection(db, "bookings");
  const toursRef = collection(db, "tours");
  const usersRef = collection(db, "users");

  // Lắng nghe Bookings làm gốc
  return onSnapshot(bookingsRef, (bookingSnap) => {
    let totalBookings = 0;
    let totalPaid = 0;
    let totalRevenue = 0;
    let pendingPayments = 0;
    const topToursMap: any = {};

    bookingSnap.forEach((doc) => {
      const data = doc.data();
      totalBookings++;
      if (data.status === "paid") {
        totalPaid++;
        totalRevenue += (Number(data.amount) || 0);
        const tourName = data.tourData?.name_tour || "Unknown";
        topToursMap[tourName] = (topToursMap[tourName] || 0) + 1;
      } else if (data.status === "pending") {
        pendingPayments++;
      }
    });

    const sortedTours = Object.entries(topToursMap)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5);

    // Lấy thêm số lượng Tour và User realtime
    onSnapshot(toursRef, (tourSnap) => {
      const activeTours = tourSnap.size;
      onSnapshot(usersRef, (userSnap) => {
        const totalUsers = userSnap.size;
        
        callback({
          totalBookings,
          totalPaid,
          totalRevenue,
          pendingPayments,
          activeTours,
          totalUsers,
          topTours: sortedTours
        });
      });
    });
  });
};