import React, { useState, useContext, useEffect } from 'react';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../_layout';
import { Avatar,TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProfile, updateProfile } from '@/utils/api';
import { getAuth } from 'firebase/auth';


const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { colors, fonts } = useContext(ThemeContext);
  const [editable, setEditable] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const idToken = await user.getIdToken(); // token firebase
        const res = await getProfile(idToken);

        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
        setPhone(res.data.phone || '');
        setEmail(res.data.email || '');
        setCountry(res.data.country || '');
        setCity(res.data.city || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        Alert.alert('Error', 'Failed to load profile.');
      }
    };

    fetchProfile();
  }, []);

  // Hàm xử lý cập nhật dữ liệu
   const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();

      const updatedData = {
        firstName,
        lastName,
        phone,
        city,
        country,
      };

      const res = await updateProfile(idToken, updatedData);

      Alert.alert('Success', 'Profile updated successfully!');
      setEditable(false);

      // Optionally cập nhật state từ response
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setPhone(res.data.phone);
      setCity(res.data.city);
      setCountry(res.data.country);
    } catch (err) {
      console.error('Update profile error:', err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

    // Hàm xử lý chuyển đổi chế độ Edit/Lock
    const handleEditLock = () => {
     
        setEditable(!editable);
    };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
        {/* ===== Tiêu đề ===== */}
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 32,
            color: colors.text,
            marginBottom: 24,
          }}
        >
          Profile
        </Text>

        {/* ===== Thông tin người dùng ===== */}
        <SafeAreaView style={styles.container}>
          <View style={styles.infoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: 'https://i.pravatar.cc/100',
                }}
                size={80}
              />
              <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                <Text style={[styles.title, { marginTop: 15 }]}>{lastName}</Text>
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    color: colors.text,
                  }}
                >
                  View profile
                </Text>
              </View>
            </View>
          </View>

          {/* ===== Form thông tin ===== */}
          <View style={styles.menuWrapper}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={handleEditLock}>
              <Text>{editable ? 'Lock' : 'Edit'}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={colors.text} size={20} />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                editable={editable}
                value={firstName}
                onChangeText={setFirstName}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    opacity: editable ? 1 : 0.6,
                  },
                ]}
              />
            </View>

            <View style={styles.action}>
              <FontAwesome name="user-o" color={colors.text} size={20} />
              <TextInput
                placeholderTextColor="#666666"
                autoCorrect={false}
                placeholder="Last Name"
                editable={editable}
                value={lastName}
                onChangeText={setLastName}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    opacity: editable ? 1 : 0.6,
                  },
                ]}
              />
            </View>

            <View style={styles.action}>
              <Feather name="phone" color={colors.text} size={20} />
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                editable={editable}
                autoCorrect={false}
                value={phone}
                onChangeText={setPhone}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    opacity: editable ? 1 : 0.6,
                  },
                ]}
              />
            </View>

            <View style={styles.action}>
              <FontAwesome name="envelope-o" color={colors.text} size={20} />
              <TextInput
                editable={editable}
                placeholder="Email"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    opacity: editable ? 1 : 0.6,
                  },
                ]}
              />
            </View>

            <View style={styles.action}>
              <FontAwesome name="map-marker" color={colors.text} size={20} />
              <TextInput
                placeholder="Address"
                placeholderTextColor="#666666"
                editable={editable}
                value={city}
                onChangeText={setCity}
                selectTextOnFocus={editable}
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    opacity: editable ? 1 : 0.6,
                  },
                ]}
              />
            </View>

            <View style={styles.action}>
              <FontAwesome name="globe" color={colors.text} size={20} />
              <TextInput
                placeholder="Country"
                editable={editable}
                value={country}
                onChangeText={setCountry}
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    opacity: editable ? 1 : 0.6,
                  },
                ]}
              />
            </View>

            
            {editable && (
              <TouchableOpacity style={[styles.commandButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
                <Text style={[styles.panelButtonTitle, { color: '#fff' }]}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};
  
export default ProfileScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  infoSection: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
   title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
   menuWrapper: {
    marginTop: 10,
  },
   menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
   textInput: {
    flex: 1,
    marginTop: -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});