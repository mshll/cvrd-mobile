import { Paths } from './paths';
import { ActivityStack, HomeStack, ProfileStack, SubscriptionsStack } from './StackNavs';
import { Circle } from 'tamagui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useColorScheme } from 'react-native';
import AddCardScreen from '@/screens/AddCardScreen';
import EditCardScreen from '@/screens/EditCardScreen';
import CardDetailsScreen from '@/screens/CardDetailsScreen';
import EditLocationScreen from '@/screens/EditLocationScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCards } from '@/hooks/useCards';
import { useCardMutations } from '@/hooks/useCardMutations';
import { WalletIcon, QueueListIcon, BellIcon, UserCircleIcon, PlusIcon } from 'react-native-heroicons/solid';
import {
  WalletIcon as WalletIconOutline,
  QueueListIcon as QueueListIconOutline,
  BellIcon as BellIconOutline,
  UserCircleIcon as UserCircleIconOutline,
} from 'react-native-heroicons/outline';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '@/components/CustomTabBar';
import AuthNav from './AuthNav';
import { TouchableOpacity } from 'react-native';
import { StarIcon } from 'react-native-heroicons/solid';
import { StarIcon as StarIconOutline } from 'react-native-heroicons/outline';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={Paths.HOME}
    >
      <Tab.Screen
        name={Paths.HOME}
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? <WalletIcon color={color} size={size} /> : <WalletIconOutline color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Paths.ACTIVITY}
        component={ActivityStack}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? <QueueListIcon color={color} size={size} /> : <QueueListIconOutline color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={'add-card-tab'}
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => <PlusIcon color={color} size={size} style={{ marginTop: 2 }} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate(Paths.ADD_CARD_SCREEN);
          },
        })}
      />
      <Tab.Screen
        name={Paths.SUBSCRIPTIONS}
        component={SubscriptionsStack}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? <BellIcon color={color} size={size} /> : <BellIconOutline color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Paths.PROFILE}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <UserCircleIcon color={color} size={size} />
            ) : (
              <UserCircleIconOutline color={color} size={size} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNav = () => {
  const colors = useColors();
  const { getCardById } = useCards();
  const { togglePinMutation } = useCardMutations();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name={Paths.EDIT_CARD} component={EditCardScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name={Paths.EDIT_LOCATION} component={EditLocationScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen
        name={Paths.CARD_DETAILS}
        component={CardDetailsScreen}
        options={({ route }) => {
          const card = getCardById(route.params.cardId);
          return {
            headerShown: true,
            headerTitle: card?.cardIcon + ' ' + card?.cardName || 'Card Details',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          };
        }}
      />
      <Stack.Screen
        name={Paths.ADD_CARD_SCREEN}
        component={AddCardScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
