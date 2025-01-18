import { Colors } from '@/config/colors';
import { View, Text } from 'tamagui';

const ProfileScreen = () => {
  return (
    <View f={1} ai="center" jc="center" bg={Colors.dark.background} color={Colors.dark.text}>
      <Text color={Colors.dark.text}>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;
