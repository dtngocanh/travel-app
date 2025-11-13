import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import { Feather, AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { registerUser } from '@/utils/api';
import { showMessage } from "react-native-flash-message";


const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

const handleSignUp = async () => {
  const newErrors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  // 1️⃣ Kiểm tra email
  if (!email) {
    newErrors.email = "Email is required";
  } else if (!validateEmail(email)) {
    newErrors.email = "Invalid email address";
  }

  // 2️⃣ Kiểm tra mật khẩu
  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  // 3️⃣ Kiểm tra xác nhận mật khẩu
  if (!confirmPassword) {
    newErrors.confirmPassword = "Confirm password is required";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  // Cập nhật state lỗi để hiển thị bên dưới input
  setErrors(newErrors);

  // 4️⃣ Nếu không có lỗi validation, tiến hành đăng ký
  if (Object.keys(newErrors).length === 0) {
    try {
      setLoading(true);

      const res = await registerUser(email, password);

      // ✅ Đăng ký thành công
      showMessage({
        message: "Đăng ký thành công 🎉",
        description: "Chào mừng bạn đến với TripGo!",
        type: "success",
        icon: "success",
        duration: 3000,
        floating: true,
      });

      router.push("/(auth)/login");

    } catch (error: any) {
      // console.error("Registration error:", error);

      let errorMessage = "Registration failed";

  // Axios trả về lỗi trong error.response.data
    if (error?.response?.data) {
      const data = error.response.data;
      if (data.code === "auth/email-already-exists") {
        errorMessage = "Email này đã được sử dụng. Vui lòng thử email khác.";
      } else if (data.code === "auth/invalid-email") {
        errorMessage = "Email không hợp lệ.";
      } else if (data.code === "auth/weak-password") {
        errorMessage = "Mật khẩu quá yếu. Vui lòng đặt ít nhất 6 ký tự.";
      } else if (data.message) {
        errorMessage = data.message;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    showMessage({
      message: "Sign up failed ❌",
      description: errorMessage,
      type: "danger",
      icon: "danger",
      duration: 3000,
      floating: true,
    });


    } finally {
      setLoading(false);
    }
  }
};

  const handleSignInRedirect = () => {
    router.push('/(auth)/login'); // quay lại Sign In
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
        {/* Tiêu đề */}
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.text,
            fontSize: 36,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Sign Up
        </Text>

        <Text
          style={{
            fontFamily: fonts.regular,
            color: colors.grayText,
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Create your new account
        </Text>

        {/* Email */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inpuBackGroundColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 4,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Feather name="mail" size={20} color={colors.grayText} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: fonts.regular,
              color: colors.text,
            }}
            placeholder="Email address"
            placeholderTextColor={colors.grayText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && (
          <Text style={{ color: 'red', fontSize: 12, marginBottom: 12, fontFamily: fonts.regular }}>
            {errors.email}
          </Text>
        )}

        {/* Password */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inpuBackGroundColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 4,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Feather name="lock" size={20} color={colors.grayText} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: fonts.regular,
              color: colors.text,
            }}
            placeholder="Password"
            placeholderTextColor={colors.grayText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={colors.grayText}
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={{ color: 'red', fontSize: 12, marginBottom: 12, fontFamily: fonts.regular }}>
            {errors.password}
          </Text>
        )}

        {/* Confirm Password */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inpuBackGroundColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 4,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Feather name="lock" size={20} color={colors.grayText} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: fonts.regular,
              color: colors.text,
            }}
            placeholder="Confirm Password"
            placeholderTextColor={colors.grayText}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setIsConfirmVisible(!isConfirmVisible)}
          >
            <Feather
              name={isConfirmVisible ? 'eye' : 'eye-off'}
              size={20}
              color={colors.grayText}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={{ color: 'red', fontSize: 12, marginBottom: 12, fontFamily: fonts.regular}}>
            {errors.confirmPassword}
          </Text>
        )}

        {/* Nút Sign Up */}
        <TouchableOpacity
          onPress={handleSignUp}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
          activeOpacity={0.9}
        >
           {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontFamily: fonts.medium }}>Sign Up</Text>
        )}
        </TouchableOpacity>

        {/* ===== Đăng nhập MXH ===== */}
        <Text
          style={{
            fontFamily: fonts.regular,
            color: colors.grayText,
            textAlign: 'center',
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Or continue with
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <TouchableOpacity
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: '#d1d5db',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}
          >
            <Entypo name="facebook" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: '#d1d5db',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}
          >
            <Entypo name="instagram" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: '#d1d5db',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}
          >
            <AntDesign name="google" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Chuyển về Sign In */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.regular,
              color: colors.grayText,
              fontSize: 14,
            }}
          >
            Already have an account?
          </Text>
          <TouchableOpacity onPress={handleSignInRedirect}>
            <Text
              style={{
                fontFamily: fonts.bold,
                color: colors.primary,
                fontSize: 14,
                marginLeft: 6,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
