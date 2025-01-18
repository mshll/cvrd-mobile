import { Colors } from '@/config/colors';
import { View, Text } from 'tamagui';

const AddCardScreen = () => {
  return (
    <View f={1} ai="center" jc="center" bg={Colors.dark.background} color={Colors.dark.text}>
      <Text color={Colors.dark.text}>AddCardScreen</Text>
    </View>
  );
};

export default AddCardScreen;
