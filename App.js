import { TamaguiProvider, Theme, YStack, Spinner } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  // ---
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  Rubik_800ExtraBold,
  Rubik_900Black,
} from '@expo-google-fonts/dev';
import MainNav from '@/navigation/MainNav';
import AuthNav from '@/navigation/AuthNav';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <YStack f={1} ai="center" jc="center" backgroundColor="$background">
    <Spinner size="large" color="$color" />
  </YStack>
);

export default function App() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    // ---
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
    Rubik_800ExtraBold,
    Rubik_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar animated={true} barStyle="default" />
              <NavigationContainer>
                {/* <Navigation /> */}
                <MainNav />
                {/* <AuthNav /> */}
              </NavigationContainer>
            </GestureHandlerRootView>
          </AuthProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
