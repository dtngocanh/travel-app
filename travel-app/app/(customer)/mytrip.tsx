import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import '../../global.css';

export default function Index() {
  return (
    <View >
      <Text className='text-4xl text-amber-600'>Home Screen</Text>
      <Link href="/explore" >
        Go to About screen
      </Link>
    </View>
  );
}
