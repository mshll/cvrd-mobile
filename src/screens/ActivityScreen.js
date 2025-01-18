import { Colors } from '@/config/colors';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'tamagui';

const ActivityScreen = () => {
  return (
    <View f={1} ai="center" jc="center" bg={Colors.dark.background} color={Colors.dark.text}>
      <Text color={Colors.dark.text}>ActivityScreen</Text>
    </View>
  );
};

export default ActivityScreen;
