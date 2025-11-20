import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Clipboard from "expo-clipboard"; // Dùng expo-clipboard cho ổn định
import { createUser } from "../../utils/api_admin";

interface Props {
  visible: boolean;
  onClose: () => void;
  onUserCreated: () => void; // callback refresh list
}

const ROLES = [
  { label: "Customer", value: "customer" },
  { label: "Admin", value: "admin" },
];

const AddUserModal: React.FC<Props> = ({ visible, onClose, onUserCreated }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [loading, setLoading] = useState(false);

  const [tempPassword, setTempPassword] = useState<string | null>(null); // lưu mật khẩu tạm
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleCreate = async () => {
    if (!email.trim()) {
      Platform.OS === "web"
        ? alert("Email is required")
        : Alert.alert("Error", "Email is required");
      return;
    }

    setLoading(true);
    try {
      const response = await createUser(email, role);

      setTempPassword(response.tempPassword || "");

      // delay để tránh crash event loop
      setTimeout(() => setShowPasswordModal(true), 50);

      // refresh list
      onUserCreated();
      setEmail("");
      setRole("customer");
    } catch (err) {
      console.log("Create user error:", err);
      setTimeout(() => {
        Platform.OS === "web"
          ? alert("Failed to create user")
          : Alert.alert("Error", "Failed to create user");
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (tempPassword) {
      await Clipboard.setStringAsync(tempPassword); // async để chắc chắn copy xong
      Platform.OS === "web"
        ? alert("Password copied!")
        : Alert.alert("Copied!", "Temporary password copied to clipboard");
    }
  };

  return (
    <>
      {/* Modal tạo user */}
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 px-5">
          <View className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg">
            <Text className="text-xl font-semibold mb-4">Add New User</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View className="mb-4">
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Picker selectedValue={role} onValueChange={(v) => setRole(v)}>
                  {ROLES.map((r) => (
                    <Picker.Item key={r.value} label={r.label} value={r.value} />
                  ))}
                </Picker>
              ) : (
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "customer" | "admin")
                  }
                  className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              )}
            </View>

            <View className="flex-row justify-end gap-4">
              <Pressable
                onPress={onClose}
                className="px-4 py-2 rounded-xl bg-gray-200"
                disabled={loading}
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleCreate}
                className={`px-4 py-2 rounded-xl bg-orange-500 ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                <Text className="font-semibold text-white">
                  {loading ? "Creating..." : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal hiển thị mật khẩu tạm thời */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-5">
          <View className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg">
            <Text className="text-xl font-semibold mb-4">User Created!</Text>
            <Text className="mb-4 text-gray-700">
              Temporary Password: <Text className="font-bold">{tempPassword}</Text>
            </Text>
            <Pressable
              onPress={handleCopy}
              className="px-4 py-2 rounded-xl bg-blue-500 mb-3"
            >
              <Text className="text-white font-semibold text-center">Copy Password</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowPasswordModal(false)}
              className="px-4 py-2 rounded-xl bg-gray-200"
            >
              <Text className="text-gray-700 font-semibold text-center">OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddUserModal;
