import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@/config/colors';
import { Paths } from './paths';
import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';

const Stack = createNativeStackNavigator();

const AuthNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Stack.Screen name={Paths.LOGIN} component={LoginScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name={Paths.SIGNUP} component={SignupScreen} options={{ animation: 'fade' }} />
    </Stack.Navigator>

  );
};

export default AuthNav;
