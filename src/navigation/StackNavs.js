import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ActivityScreen from '@/screens/ActivityScreen';
import { Paths } from './paths';
import SubscriptionsScreen from '@/screens/SubscriptionsScreen';
import { Colors } from '@/config/colors';
import { Image, TouchableOpacity } from 'react-native';
import CardDetailsScreen from '@/screens/CardDetailsScreen';
import { TransitionPresets } from '@react-navigation/stack';
import AddCardScreen from '@/screens/AddCardScreen';
import EditCardScreen from '@/screens/EditCardScreen';
import EditLocationScreen from '@/screens/EditLocationScreen';
import { PowerIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import PersonalInfoScreen from '@/screens/PersonalInfoScreen';
import SecurityScreen from '@/screens/SecurityScreen';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerShown: true,
  headerBackButtonDisplayMode: 'minimal',
  headerStyle: {
    backgroundColor: Colors.dark.background,
  },
  headerTintColor: Colors.dark.text,
  contentStyle: {
    backgroundColor: Colors.dark.background,
  },
  headerTitleStyle: {
    fontFamily: '$archivoBlack',
    fontSize: 20,
  },
  headerBackTitleVisible: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

const modalScreenOptions = {
  headerShown: false,
  presentation: 'modal',
  ...TransitionPresets.ModalPresentationIOS,
  gestureEnabled: true,
  animationEnabled: true,
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
        name={Paths.HOME_SCREEN}
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <Image source={require('@/../assets/logo-primary.png')} style={{ height: 24, resizeMode: 'contain' }} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export const ActivityStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Image source={require('@/../assets/logo-primary.png')} style={{ height: 24, resizeMode: 'contain' }} />
          ),
        }}
        name={Paths.ACTIVITY_SCREEN}
        component={ActivityScreen}
      />
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name={Paths.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 8 }}>
              <PowerIcon size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name={Paths.PERSONAL_INFO}
        component={PersonalInfoScreen}
        options={{
          title: 'Personal Information',
        }}
      />
      <Stack.Screen
        name={Paths.SECURITY}
        component={SecurityScreen}
        options={{
          title: 'Security',
        }}
      />
    </Stack.Navigator>
  );
};

export const SubscriptionsStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={Paths.SUBSCRIPTIONS_SCREEN} component={SubscriptionsScreen} />
    </Stack.Navigator>
  );
};

export function MainStack() {
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
