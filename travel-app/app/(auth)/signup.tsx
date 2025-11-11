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
const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const handleSignUp = () => {
    // Xử lý đăng ký ở đây
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

        {/* Password */}
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

        {/* Confirm Password */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inpuBackGroundColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 24,
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
          <Text
            style={{
              fontFamily: fonts.bold,
              color: '#fff',
              fontSize: 18,
            }}
          >
            Sign Up
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
