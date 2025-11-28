import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAdminStats = async () => {
  try {
    const snap = await getDocs(collection(db, "bookings"));

    let totalBookings = 0;
    let totalPaid = 0;
    let totalRevenue = 0;

    const revenueByDate: any = {};
    const topTours: any = {};
    const topUsers: any = {};

    snap.forEach((doc) => {
      const data = doc.data();
      totalBookings++;

      if (data.status === "paid") {
        totalPaid++;

        const price = data.tourData?.price_tour || 0;
        totalRevenue += price;

        // Doanh thu theo ngày
        if (data.createdAt) {
          const date = data.createdAt.toDate().toISOString().split("T")[0];
          revenueByDate[date] = (revenueByDate[date] || 0) + price;
        }

        // Top tour
        const tourId = data.tourId;
        topTours[tourId] = (topTours[tourId] || 0) + 1;

        // Top user
        const userId = data.userId;
        topUsers[userId] = (topUsers[userId] || 0) + 1;
      }
    });

    // Sort top tours
    const sortedTours = Object.entries(topTours)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5);

    // Sort top users
    const sortedUsers = Object.entries(topUsers)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalBookings,
      totalPaid,
      totalRevenue,
      revenueByDate,
      topTours: sortedTours,
      topUsers: sortedUsers
    };

  } catch (e) {
    console.log("Error getting admin stats:", e);
    throw e;
  }
};
