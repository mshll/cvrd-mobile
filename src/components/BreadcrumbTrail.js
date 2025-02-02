import { memo } from 'react';
import { View } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withDelay, withSpring } from 'react-native-reanimated';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Colors } from '@/config/colors';
import { Dimensions } from 'react-native';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const BREADCRUMB_HEIGHT = 44;
const BREADCRUMB_WIDTH = WINDOW_WIDTH * 0.7;

const BreadcrumbTrail = memo(({ showTrail }) => {
  const { currentStep } = useBreadcrumb();

  const breadcrumbStyle = useAnimatedStyle(() => {
    return {
      opacity: showTrail ? withDelay(200, withSpring(1, { damping: 12, stiffness: 35 })) : 0,
      transform: [{
        translateY: showTrail 
          ? withDelay(200, withSpring(0, { damping: 12, stiffness: 35 })) 
          : -20
      }]
    };
  });

  const renderStep = (step, icon) => {
    const isActive = currentStep >= step;
    return (
      <View 
        backgroundColor={isActive ? Colors.dark.primary : 'transparent'}
        width={BREADCRUMB_HEIGHT - 8} 
        height={BREADCRUMB_HEIGHT - 8}
        borderRadius={(BREADCRUMB_HEIGHT - 8) / 2}
        margin={4}
        alignItems="center"
        justifyContent="center"
        opacity={isActive ? 1 : 0.5}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color={isActive ? 'white' : Colors.dark.text} 
        />
      </View>
    );
  };

  return (
    <Animated.View style={breadcrumbStyle}>
      <View 
        backgroundColor={Colors.dark.backgroundSecondary}
        width={BREADCRUMB_WIDTH}
        height={BREADCRUMB_HEIGHT}
        borderRadius={BREADCRUMB_HEIGHT / 2}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={4}
      >
        {renderStep(1, 'card')}
        {renderStep(2, 'settings-sharp')}
        {renderStep(3, 'checkmark')}
      </View>
    </Animated.View>
  );
});

export default BreadcrumbTrail; 