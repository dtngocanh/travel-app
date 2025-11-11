import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import { Feather } from '@expo/vector-icons';

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // TODO: Gửi yêu cầu reset password
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: fonts.bold, color: colors.text, fontSize: 36, textAlign: 'center', marginBottom: 8 }}>Forgot Password</Text>
        <Text style={{ fontFamily: fonts.regular, color: colors.grayText, fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
          Enter your email to reset your password
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inpuBackGroundColor, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 24 }}>
          <Feather name="mail" size={20} color={colors.grayText} />
          <TextInput
            style={{ flex: 1, marginLeft: 12, fontSize: 16, fontFamily: fonts.regular, color: colors.text }}
            placeholder="Email"
            placeholderTextColor={colors.grayText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity onPress={handleResetPassword} style={{ backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontFamily: fonts.bold, color: '#fff', fontSize: 18 }}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={{ fontFamily: fonts.bold, color: colors.primary, fontSize: 14, textAlign: 'center' }}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
