import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ActivityScreen from '@/screens/ActivityScreen';
import { Paths } from './paths';
import SubscriptionsScreen from '@/screens/SubscriptionsScreen';
import { Colors } from '@/config/colors';
import { Image } from 'react-native';
import CardDetailsScreen from '@/screens/CardDetailsScreen';
import { TransitionPresets } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: Colors.dark.background,
  },
  headerTintColor: Colors.dark.text,
  contentStyle: {
    backgroundColor: Colors.dark.background,
  },
};

export const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        animationEnabled: true,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name={Paths.HOME}
        component={HomeScreen}
        options={{
          headerTitle: () => <Image source={require('@/../assets/cvrd-logo-white.png')} style={{ height: 50, resizeMode: 'contain' }} />,
        }}
      />
    </Stack.Navigator>
  );
};

export const ActivityStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={Paths.ACTIVITY} component={ActivityScreen} />
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={Paths.PROFILE} component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export const SubscriptionsStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={Paths.SUBSCRIPTIONS} component={SubscriptionsScreen} />
    </Stack.Navigator>
  );
};
