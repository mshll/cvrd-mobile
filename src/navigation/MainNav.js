import { Paths } from './paths';
import { ActivityStack, HomeStack, ProfileStack, SubscriptionsStack } from './StackNavs';
import { Circle, useTheme } from 'tamagui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@/config/colors';
import { useColorScheme } from 'react-native';
import AddCardScreen from '@/screens/AddCardScreen';
import EditCardScreen from '@/screens/EditCardScreen';
import CardDetailsScreen from '@/screens/CardDetailsScreen';
import { AnimatedTabBarNavigator } from '@/lib/react-native-animated-nav-tab-bar/dist/lib';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCards } from '@/hooks/useCards';
import {
  WalletIcon,
  QueueListIcon,
  BellIcon,
  UserCircleIcon,
  PlusIcon,
} from 'react-native-heroicons/solid';
import {
  WalletIcon as WalletIconOutline,
  QueueListIcon as QueueListIconOutline,
  BellIcon as BellIconOutline,
  UserCircleIcon as UserCircleIconOutline,
} from 'react-native-heroicons/outline';

const Tab = AnimatedTabBarNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.dark.primary,
        inactiveTintColor: Colors.dark.textSecondary,
        tabStyle: {
          marginBottom: insets.bottom,
        },
      }}
      appearance={{
        tabBarBackground: Colors.dark.card,
        tabBarBorderColor: Colors.dark.border,
        floating: true,
        whenActiveShow: 'icon-only',
      }}
      initialRouteName={Paths.HOME}
    >
      <Tab.Screen
        name={Paths.HOME}
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <WalletIcon color={color} size={size} />
            ) : (
              <WalletIconOutline color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name={Paths.ACTIVITY}
        component={ActivityStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <QueueListIcon color={color} size={size} />
            ) : (
              <QueueListIconOutline color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name={'add-card-tab'}
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Circle backgroundColor={Colors.dark.card} padding={7} position="absolute">
              <Circle backgroundColor={Colors.dark.primary} padding={15}>
                <PlusIcon color={'black'} size={size + 10} />
              </Circle>
            </Circle>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(Paths.ADD_CARD_SCREEN);
          },
          tabLongPress: () => {
            navigation.navigate(Paths.ADD_CARD_SCREEN);
          },
        })}
      />
      <Tab.Screen
        name={Paths.SUBSCRIPTIONS}
        component={SubscriptionsStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <BellIcon color={color} size={size} />
            ) : (
              <BellIconOutline color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name={Paths.PROFILE}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <UserCircleIcon color={color} size={size} />
            ) : (
              <UserCircleIconOutline color={color} size={size} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const MainNav = () => {
  const colorScheme = useColorScheme();
  const { getCardById } = useCards();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        contentStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name={Paths.ADD_CARD_SCREEN}
        component={AddCardScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name={Paths.EDIT_CARD}
        component={EditCardScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name={Paths.CARD_DETAILS}
        component={CardDetailsScreen}
        options={({ route }) => {
          const card = getCardById(route.params.cardId);
          return {
            headerShown: true,
            headerTitle: card?.card_name || 'Card Details',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
