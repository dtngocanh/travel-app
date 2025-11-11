import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import { Feather, AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { push } from 'expo-router/build/global-state/routing';

const SignInScreen: React.FC = () => {
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignIn = () => {};
  const handleForgotPassword = () => {
    router.push('/(auth)/forgortpass')
  };
  const handleSignUp = () => {
    router.push('/(auth)/signup')
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
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
            marginBottom: 16,
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
              color: colors.text, // đảm bảo chữ hiển thị
            }}
            placeholder="Email address"
            placeholderTextColor={colors.grayText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* ===== Ô nhập Password ===== */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inpuBackGroundColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 8,
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

        {/* ===== Quên mật khẩu ===== */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={{ alignSelf: 'flex-end', marginBottom: 24 }}
        >
          <Text style={{ color: colors.primary, fontSize: 14, fontFamily: fonts.medium }}>
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
          <Text
            style={{
              fontFamily: fonts.bold,
              color: '#fff',
              fontSize: 18,
            }}
          >
            Sign In
          </Text>
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
  );
};

export default SignInScreen;
