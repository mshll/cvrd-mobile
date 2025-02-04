import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors, useColors } from '@/config/colors';
import { Paths } from './paths';
import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import SignupDetailsScreen from '@/screens/SignupDetailsScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import ConnectBankScreen from '@/screens/ConnectBankScreen';

const Stack = createNativeStackNavigator();

const AuthNav = () => {
  const colors = useColors();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'fade',
        presentation: 'transparentModal',
      }}
      initialRouteName={Paths.ONBOARDING}
    >
      <Stack.Screen name={Paths.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={Paths.LOGIN} component={LoginScreen} />
      <Stack.Screen name={Paths.SIGNUP} component={SignupScreen} />
      <Stack.Screen name={Paths.SIGNUP_DETAILS} component={SignupDetailsScreen} />
      <Stack.Screen name={Paths.CONNECT_BANK} component={ConnectBankScreen} />
    </Stack.Navigator>
  );
};

export default AuthNav;
