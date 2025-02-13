import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ActivityScreen from '@/screens/ActivityScreen';
import { Paths } from './paths';
import SubscriptionsScreen from '@/screens/SubscriptionsScreen';
import AllMerchantsScreen from '@/screens/AllMerchantsScreen';
import AllStoresScreen from '@/screens/AllStoresScreen';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { Image, TouchableOpacity, Animated, View, Easing, useColorScheme } from 'react-native';
import CardDetailsScreen from '@/screens/CardDetailsScreen';
import { TransitionPresets } from '@react-navigation/stack';
import AddCardScreen from '@/screens/AddCardScreen';
import EditCardScreen from '@/screens/EditCardScreen';
import EditLocationScreen from '@/screens/EditLocationScreen';
import { PowerIcon } from 'react-native-heroicons/outline';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import PersonalInfoScreen from '@/screens/PersonalInfoScreen';
import SecurityScreen from '@/screens/SecurityScreen';
import { useEffect, useRef } from 'react';
import ConnectBankScreen from '@/screens/ConnectBankScreen';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = (colors) => ({
  headerShown: true,
  headerBackButtonDisplayMode: 'minimal',
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: colors.background,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: colors.text,
  contentStyle: {
    backgroundColor: colors.background,
  },
  headerTitleStyle: {
    fontFamily: '$archivoBlack',
    fontSize: 20,
  },
  headerBackTitleVisible: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
});

const modalScreenOptions = {
  headerShown: false,
  presentation: 'modal',
  ...TransitionPresets.ModalPresentationIOS,
  gestureEnabled: true,
  animationEnabled: true,
};

// Animated Logo Component
const AnimatedLogo = ({ routeName }) => {
  const logoColorAnim = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Define color values based on route
    const targetValue =
      routeName === Paths.HOME_SCREEN
        ? 0
        : routeName === Paths.ACTIVITY_SCREEN
        ? 1
        : routeName === Paths.SUBSCRIPTIONS_SCREEN
        ? 2
        : routeName === Paths.PROFILE
        ? 3
        : 0;

    Animated.timing(logoColorAnim, {
      toValue: targetValue,
      duration: 800,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [routeName]);

  return (
    <View style={{ width: 100, height: 24, position: 'relative' }}>
      {/* Base logo part 1 (static black/white based on theme) */}
      <Image
        source={colorScheme === 'dark' ? require('@/../assets/logo-p1.png') : require('@/../assets/logo-p1-dark.png')}
        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
      {/* Logo part 2 (animated color) */}
      <Animated.Image
        source={require('@/../assets/logo-p2.png')}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
            opacity: logoColorAnim.interpolate({
              inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
              outputRange: [1, 0.6, 1, 0.6, 1, 0.6, 1],
            }),
            tintColor: logoColorAnim.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [Colors.cards.green, Colors.cards.blue, Colors.cards.yellow, Colors.cards.pink],
            }),
          },
        ]}
      />
    </View>
  );
};

export const HomeStack = () => {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultScreenOptions(colors),
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        animationEnabled: true,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name={Paths.HOME_SCREEN}
        component={HomeScreen}
        options={{
          headerTitle: () => <AnimatedLogo routeName={Paths.HOME_SCREEN} />,
        }}
      />
    </Stack.Navigator>
  );
};

export const ActivityStack = () => {
  const colors = useColors();
  return (
    <Stack.Navigator screenOptions={{ ...defaultScreenOptions(colors) }}>
      <Stack.Screen
        options={{
          headerTitle: () => <AnimatedLogo routeName={Paths.ACTIVITY_SCREEN} />,
        }}
        name={Paths.ACTIVITY_SCREEN}
        component={ActivityScreen}
      />
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  const colors = useColors();
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions(colors)}>
      <Stack.Screen
        name={Paths.PROFILE}
        component={ProfileScreen}
        options={{
          headerTitle: () => <AnimatedLogo routeName={Paths.PROFILE} />,
        }}
      />
      <Stack.Screen
        name={Paths.PERSONAL_INFO}
        component={PersonalInfoScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Paths.SECURITY}
        component={SecurityScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export const SubscriptionsStack = () => {
  const colors = useColors();
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions(colors)}>
      <Stack.Screen
        name={Paths.SUBSCRIPTIONS_SCREEN}
        component={SubscriptionsScreen}
        options={{
          headerTitle: () => <AnimatedLogo routeName={Paths.SUBSCRIPTIONS_SCREEN} />,
        }}
      />
      <Stack.Screen
        name={Paths.ALL_MERCHANTS}
        component={AllMerchantsScreen}
        options={{
          headerTitle: 'All Merchants',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={Paths.ALL_STORES}
        component={AllStoresScreen}
        options={{
          headerTitle: 'All Stores',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export function MainStack() {
  const colors = useColors();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name={Paths.HOME} component={HomeScreen} />
      <Stack.Screen name={Paths.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={Paths.CARD_DETAILS} component={CardDetailsScreen} />
      <Stack.Screen name={Paths.EDIT_CARD} component={EditCardScreen} />
      <Stack.Screen name={Paths.EDIT_LOCATION} component={EditLocationScreen} />
      <Stack.Screen name={Paths.ADD_CARD_SCREEN} component={AddCardScreen} />
    </Stack.Navigator>
  );
}
