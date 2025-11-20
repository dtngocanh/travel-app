import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {listenUsers} from "../../src/services/userService"
import { getUserList, deleteUser, createUser } from "../../utils/api_admin";
import UserDetailModal from "./_userdetail";
import AddUserModal from "./_addusermodal";

const PAGE_SIZE = 5;

interface User {
  uid: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar?: string;
  createdAt?: { _seconds: number };
}

const ROLES = [
  { label: "All Roles", value: "all" },
  { label: "Customer", value: "customer" },
  { label: "Admin", value: "admin" },
];

const GetUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean; uid: string | null }>({
    visible: false,
    uid: null,
  });

  // Add User
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("customer");


  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width > 768;

  // Fetch users
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await getUserList();
  //       const allUsers = res.data;
  //       setUsers(allUsers);
  //       setFiltered(allUsers);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUsers();
  // }, []);
  useEffect(() => {
  const unsubscribe = listenUsers((newUsers) => {
    setUsers(newUsers);
    setLoading(false);
  });

  return () => unsubscribe(); // cleanup khi component unmount
}, []);

  // Filter logic
  useEffect(() => {
    let temp = [...users];

    if (searchEmail.trim() !== "") {
      temp = temp.filter((u) => u.email.toLowerCase().includes(searchEmail.toLowerCase()));
    }
    if (filterRole !== "all") {
      temp = temp.filter((u) => u.role === filterRole);
    }

    setFiltered(temp);
    setPage(1);
  }, [searchEmail, filterRole, users]);

  const paginatedData = isWeb ? filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : filtered;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Delete logic
  const handleDelete = async (uid: string) => {
    try {
      await deleteUser(uid);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      setConfirmDelete({ visible: false, uid: null });
      if (Platform.OS === "web") alert("User deleted successfully!");
    } catch (err) {
      console.log("Delete error:", err);
      if (Platform.OS === "web") alert("Failed to delete user");
    }
  };

  const onDelete = (uid: string) => {
    if (Platform.OS === "web") {
      setConfirmDelete({ visible: true, uid });
    } else {
      // Mobile Alert
      import("react-native").then(({ Alert }) => {
        Alert.alert("Delete User", "Are you sure you want to delete this user?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => handleDelete(uid) },
        ]);
      });
    }
  };


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#eb7b25ff" />
        <Text className="mt-2 text-orange-600">Loading user data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Title */}
      {/* <Text className="text-3xl mb-6 text-gray-800 border-b border-b-gray-300 pb-2">
        User Management
      </Text> */}
      <View className="flex-row justify-between items-center mb-6 border-b border-b-gray-300">
        <Text className="text-3xl text-gray-800  pb-2 font-bold">
          User Management
        </Text>

        <Pressable
          onPress={() => setAddUserVisible(true)}
          className="bg-orange-500 px-4 py-2 rounded-xl shadow-sm"
        >
          <Text className="text-white font-semibold">Add User</Text>
        </Pressable>
    </View>


      {/* Filters */}
      <View className="flex-row gap-4 mb-6 items-center">
        <TextInput
          placeholder="Search by email..."
          value={searchEmail}
          onChangeText={setSearchEmail}
          style={{ height: 52 }}
          className="flex-1 px-3 bg-white border border-gray-300 rounded-xl shadow-sm text-base focus:border-blue-500"
        />
        {Platform.OS === "ios" || Platform.OS === "android" ? (
          <View className="w-40 bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
            <Picker
              selectedValue={filterRole}
              onValueChange={(itemValue) => setFilterRole(itemValue)}
              style={{ height: 50, width: "100%" }}
            >
              {ROLES.map((role) => (
                <Picker.Item key={role.value} label={role.label} value={role.value} />
              ))}
            </Picker>
          </View>
        ) : (
          <TextInput
            placeholder="Role (all/customer/admin)"
            value={filterRole}
            onChangeText={setFilterRole}
            className="w-40 p-3 bg-white border border-gray-300 rounded-xl shadow-sm text-base focus:border-blue-500"
          />
        )}
      </View>

      {/* User Table / List */}
      {filtered.length === 0 ? (
        <View className="flex-1 justify-center items-center p-10 bg-white rounded-xl shadow-lg">
          <Text className="text-xl text-gray-500 font-semibold">
            No users found matching the filter criteria.
          </Text>
        </View>
      ) : isWeb ? (
        <ScrollView horizontal className="overflow-x-auto">
          <View className="bg-white rounded-xl shadow-lg border border-gray-200 min-w-[950px] w-full">
            {/* Header */}
            <View className="flex-row bg-blue-50 p-4 border-b border-gray-200 rounded-t-xl">
              <Text className="w-16 font-bold text-blue-700">#</Text>
              <Text className="w-64 font-bold text-blue-700">Email</Text>
              <Text className="w-36 font-bold text-blue-700">Phone</Text>
              <Text className="w-36 font-bold text-blue-700">City</Text>
              <Text className="w-36 font-bold text-blue-700">Country</Text>
              <Text className="w-24 font-bold text-blue-700">Role</Text>
              <Text className="w-24 font-bold text-blue-700 text-center">Action</Text>
            </View>

            {/* Rows */}
            {paginatedData.map((item, index) => (
              <View
                key={item.uid}
                className="flex-row p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150 items-center gap-2"
              >
                <Text className="w-16 text-gray-700">{index + 1 + (page - 1) * PAGE_SIZE}</Text>
                <Text className="w-64 font-medium text-blue-600 truncate">{item.email}</Text>
                <Text className="w-36 text-gray-600">{item.phone || "---"}</Text>
                <Text className="w-36 text-gray-600 truncate">{item.city || "---"}</Text>
                <Text className="w-36 text-gray-600 truncate">{item.country || "---"}</Text>
                <Text
                  className={`w-24 font-semibold ${
                    item.role === "admin" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {item.role.toUpperCase()}
                </Text>
                <Pressable
                  onPress={() => setSelectedUser(item)}
                  className="w-24 bg-blue-500 py-1 rounded-lg flex justify-center items-center"
                >
                  <Text className="text-white text-xs font-semibold">Details</Text>
                </Pressable>
                <Pressable
                  onPress={() => onDelete(item.uid)}
                  className="bg-red-500 py-1 px-2 rounded-lg flex justify-center items-center"
                >
                  <Text className="text-white text-xs font-semibold">Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedUser(item)}
              className="bg-white p-4 mb-3 rounded-xl shadow-md border border-gray-100 active:bg-gray-50 flex-row justify-between items-center"
            >
              <View>
                <Text className="font-bold text-lg text-gray-800">{item.email}</Text>
                <Text
                  className={`text-sm mt-1 font-medium ${
                    item.role === "admin" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  Role: {item.role.toUpperCase()}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.city || "No city"}, {item.country || "No country"}
                </Text>
              </View>
              <Pressable onPress={() => onDelete(item.uid)} className="p-2">
                <Ionicons name="trash-outline" size={24} color="red" />
              </Pressable>
            </Pressable>
          )}
        />
      )}

      {/* Pagination */}
      {isWeb && totalPages > 1 && (
        <View className="flex-row justify-center items-center mt-6 space-x-2">
          <Pressable
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-200" : "bg-blue-500"}`}
          >
            <Text className={`${page === 1 ? "text-gray-500" : "text-white"}`}>« Previous</Text>
          </Pressable>
          <View className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
            <Text className="font-semibold text-gray-700">
              Page {page} / {totalPages}
            </Text>
          </View>
          <Pressable
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${page === totalPages ? "bg-gray-200" : "bg-blue-500"}`}
          >
            <Text className={`${page === totalPages ? "text-gray-500" : "text-white"}`}>Next »</Text>
          </Pressable>
        </View>
      )}

      {/* User Detail Modal */}
      <UserDetailModal visible={!!selectedUser} user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* Confirm Modal for Web */}
      {Platform.OS === "web" && (
        <Modal visible={confirmDelete.visible} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50 px-5">
            <View className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg">
              <Text className="text-lg font-semibold mb-4">Delete User</Text>
              <Text className="text-gray-700 mb-6">
                Are you sure you want to delete this user?
              </Text>
              <View className="flex-row justify-end gap-4">
                <Pressable
                  onPress={() => setConfirmDelete({ visible: false, uid: null })}
                  className="px-4 py-2 rounded-xl bg-gray-200"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmDelete.uid && handleDelete(confirmDelete.uid)}
                  className="px-4 py-2 rounded-xl bg-red-500"
                >
                  <Text className="text-white font-semibold">Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <AddUserModal
          visible={addUserVisible}
          onClose={() => setAddUserVisible(false)}
          onUserCreated={async () => {
            // refresh list
            const res = await getUserList();
            setUsers(res.data);
          }}
    />

    </View>
    
  );
};

export default GetUserList;
