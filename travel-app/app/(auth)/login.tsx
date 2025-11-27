import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import { Feather, AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { loginUser } from '../../src/services/authService';
import { checkOrCreateUser } from '../../utils/api'
import { showMessage } from "react-native-flash-message";
import { useAuth } from '../../src/contexts/AuthContex';

const SignInScreen: React.FC = () => {

 const { setUser } = useAuth();
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);


  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // const handleSignIn = async () => {
  //   const newErrors: { email?: string; password?: string } = {};

  //   //  Validate
  //   if (!email) newErrors.email = "Email is required";
  //   else if (!validateEmail(email)) newErrors.email = "Invalid email address";

  //   if (!password) newErrors.password = "Password is required";
  //   else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

  //   setErrors(newErrors);

  //   if (Object.keys(newErrors).length > 0) return;

  //   try {
  //     setLoading(true);

  //     //  Call backend/Firebase login
  //     const user = await loginUser(email, password); // user = { email, role, idToken }

  //     // Check or create profile in backend DB
  //     try {
  //       if (!user.uid || !user.email) {
  //         console.warn("User UID or email is null, cannot check/create profile");
  //       } else {
  //         const res = await checkOrCreateUser(user.uid, user.email);
  //         console.log("CheckOrCreateUser response:", res.data);
  //       }
  //     } catch (err) {
  //       console.error("checkOrCreateUser error:", err);
  //     }


  //     showMessage({
  //       message: "Login Successful 🎉",
  //       description: `Welcome back, ${user.email}!`,
  //       type: "success",
  //       icon: "success",
  //       duration: 2500,
  //       floating: true,
  //     });


  //     //  Navigate based on role
  //     if (user.role === "admin") {
  //       router.replace("/(admin)/home"); // admin dashboard
  //     } else {
  //       router.replace("/(customer)"); // normal user
  //     }



  //   } catch (error: any) {
  //     //  Handle errors
  //     let errorMessage = "Login Failed";

  //     switch (error.code) {
  //       case "auth/email-already-in-use":
  //         errorMessage = "This email is already in use. Please try another one.";
  //         break;
  //       case "auth/invalid-email":
  //         errorMessage = "Invalid email address. Please enter a correct format.";
  //         break;
  //       case "auth/weak-password":
  //         errorMessage = "Password is too weak. Please use at least 6 characters.";
  //         break;
  //       case "auth/user-not-found":
  //         errorMessage = "This email is not registered.";
  //         break;
  //       case "auth/wrong-password":
  //         errorMessage = "Incorrect password. Please try again.";
  //         break;
  //       case "auth/invalid-credential":
  //         errorMessage = "Invalid login credentials. Please try again.";
  //         break;
  //       default:
  //         if (error.message) errorMessage = error.message;
  //         break;
  //     }

  //     showMessage({
  //       message: "Login Failed ❌",
  //       description: errorMessage,
  //       type: "danger",
  //       icon: "danger",
  //       duration: 3000,
  //       floating: true,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }


  // };

const handleSignIn = async () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const userData = await loginUser(email, password);

      // save AuthContext + AsyncStorage
      await setUser(userData);

      router.replace("/");

      // sync backend
      if (userData.uid && userData.email) {
        await checkOrCreateUser(userData.uid, userData.email);
      }

      showMessage({
        message: "Login Successful 🎉",
        description: `Welcome back, ${userData.email}!`,
        type: "success",
        icon: "success",
        duration: 2500,
        floating: true,
      });

      
    } catch (error: any) {
      let errorMessage = error.message || "Login Failed";

      switch (error.code) {
        case "auth/user-not-found": errorMessage = "This email is not registered."; break;
        case "auth/wrong-password": errorMessage = "Incorrect password. Please try again."; break;
      }

      showMessage({
        message: "Login Failed ❌",
        description: errorMessage,
        type: "danger",
        icon: "danger",
        duration: 3000,
        floating: true,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = () => {
    router.push('/(auth)/forgortpass');
  };
  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: '100%',
          maxWidth: 450,
          paddingHorizontal: 32 // Chuyển padding vào đây
        }}>
          {/* ===== Tiêu đề ===== */}
          <Text
            style={{
              fontFamily: fonts.bold,
              color: colors.text,
              fontSize: 36,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Login
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
            Sign in to continue your journey
          </Text>

          {/* ===== Ô nhập Email ===== */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.inpuBackGroundColor,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginBottom: 10,
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

          {/* ===== Ô nhập Password ===== */}
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
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
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

          {/* ===== Quên mật khẩu ===== */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={{ alignSelf: 'flex-end', marginBottom: 24 }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 14,
                fontFamily: fonts.medium,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* ===== Nút Sign In ===== */}
          <TouchableOpacity
            onPress={handleSignIn}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 40,
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
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: fonts.medium }}>Login</Text>
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

          {/* ===== Link Đăng ký ===== */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text
              style={{
                fontFamily: fonts.regular,
                color: colors.grayText,
                fontSize: 14,
              }}
            >
              Don’t have an account?
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.primary,
                  fontSize: 14,
                  marginLeft: 6,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
