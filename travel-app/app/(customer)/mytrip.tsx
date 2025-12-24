import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native"
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore"
import { db } from "../../utils/firebase"

/* ================= TYPES ================= */

type TourData = {
  image_tour: string
  name_tour: string
  location_tour: string
}

type Booking = {
  id: string
  amount: number
  status: "paid" | "completed" | "canceled"
  createdAt: Timestamp
  tourData: TourData
}

type TabType = "upcoming" | "completed" | "canceled"

type Props = {
  userId: string
}

/* ================= COMPONENT ================= */

export default function MyBookings({ userId }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("upcoming")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    let isMounted = true // ⭐ QUAN TRỌNG

    const fetchBookings = async () => {
      try {
        if (isMounted) setLoading(true)

        const q = query(
          collection(db, "bookings"),
          where("userId", "==", userId)
        )

        const snapshot = await getDocs(q)

        if (!isMounted) return // ⭐ STOP nếu unmount

        const data: Booking[] = snapshot.docs
          .map(doc => {
            const d = doc.data() as any
            if (!d.tourData?.image_tour) return null

            return {
              id: doc.id,
              amount: d.amount,
              status: d.status,
              createdAt: d.createdAt,
              tourData: d.tourData,
            }
          })
          .filter(Boolean) as Booking[]

        setBookings(data)
      } catch (err) {
        console.log("❌ Fetch bookings error:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBookings()

    // ⭐ CLEANUP
    return () => {
      isMounted = false
    }
  }, [userId])

  /* ================= FILTER ================= */

  const filteredBookings = bookings.filter(item => {
    if (activeTab === "upcoming") return item.status === "paid"
    if (activeTab === "completed") return item.status === "completed"
    if (activeTab === "canceled") return item.status === "canceled"
    return false
  })

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">My Bookings</Text>

      {/* Tabs */}
      <View className="flex-row mb-4">
        {(["upcoming", "completed", "canceled"] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-4 py-2 mr-2 rounded-full ${
              activeTab === tab ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <Text className={activeTab === tab ? "text-white" : "text-gray-700"}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-20">
            No bookings found
          </Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl mb-4 overflow-hidden shadow">
            <Image
              source={{ uri: item.tourData.image_tour }}
              className="h-44 w-full"
              resizeMode="cover"
            />

            <View className="p-4">
              <Text className="text-lg font-semibold mb-1">
                {item.tourData.name_tour}
              </Text>

              <Text className="text-gray-500 text-sm mb-2">
                {item.tourData.location_tour}
              </Text>

              <View className="flex-row justify-between items-center">
                <Text className="text-blue-600 font-bold">
                  ${item.amount}
                </Text>

                <Text
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "paid"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </Text>
              </View>

              <Text className="text-xs text-gray-400 mt-2">
                Booked at: {item.createdAt.toDate().toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}
