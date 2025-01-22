import { UserRound, WalletCards, List, Plus, Bell } from '@tamagui/lucide-icons';
import { Paths } from './paths';
import { ActivityStack, HomeStack, ProfileStack, SubscriptionsStack } from './StackNavs';
import { Circle, useTheme } from 'tamagui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@/config/colors';
import { useColorScheme } from 'react-native';
import AddCardScreen from '@/screens/AddCardScreen';
import { AnimatedTabBarNavigator } from '@/lib/react-native-animated-nav-tab-bar/dist/lib';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CardDetailsScreen from '@/screens/CardDetailsScreen';

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
          tabBarIcon: ({ color, size }) => <WalletCards color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Paths.ACTIVITY}
        component={ActivityStack}
        options={{
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={'add-card-tab'}
        component={HomeStack} // Won't be shown
        options={{
          tabBarIcon: ({ color, size }) => (
            <Circle backgroundColor={Colors.dark.primary} padding={15} position="absolute" bw={'$1.5'} bc={Colors.dark.card}>
              <Plus color={Colors.dark.text} size={size + 10} />
            </Circle>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(Paths.ADD_CARD);
          },
          tabLongPress: () => {
            navigation.navigate(Paths.ADD_CARD);
          },
        })}
      />
      <Tab.Screen
        name={Paths.SUBSCRIPTIONS}
        component={SubscriptionsStack}
        options={{
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Paths.PROFILE}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNav = () => {
  const colorScheme = useColorScheme();

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
      <Stack.Screen name={Paths.ADD_CARD} component={AddCardScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen
        name={Paths.CARD_DETAILS}
        component={CardDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Card Details',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
