import { Colors, useColors } from '@/config/colors';
import { View, Text } from 'tamagui';

const SubscriptionsScreen = () => {
  const colors = useColors();
  return (
    <View f={1} ai="center" jc="center" bg={colors.background} color={colors.text}>
      <Text color={colors.text}>SubscriptionsScreen</Text>
    </View>
  );
};

export default SubscriptionsScreen;
