import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Paths } from './paths';

const Stack = createNativeStackNavigator();

const AuthNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={Paths.ONBOARDING}>
      {/* TODO: onboarding, login, signup */}
    </Stack.Navigator>
  );
};

export default AuthNav;
