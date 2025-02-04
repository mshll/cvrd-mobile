import { TamaguiProvider, Theme, YStack, Spinner } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  // ---
  Archivo_100Thin,
  Archivo_200ExtraLight,
  Archivo_300Light,
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
  Archivo_900Black,
  Archivo_900Black_Italic,
} from '@expo-google-fonts/dev';
import MainNav from '@/navigation/MainNav';
import AuthNav from '@/navigation/AuthNav';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { BreadcrumbProvider } from '@/context/BreadcrumbContext';
import toastConfig from '@/config/toastConfig';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <YStack f={1} ai="center" jc="center" backgroundColor="$background">
    <Spinner size="large" color="$color" />
  </YStack>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    // ---
    Archivo_100Thin,
    Archivo_200ExtraLight,
    Archivo_300Light,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
    Archivo_900Black,
    Archivo_900Black_Italic,
  });
  const colorScheme = useColorScheme();

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TamaguiProvider config={tamaguiConfig}>
            <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
              <AuthProvider>
                <BreadcrumbProvider>
                  <PortalProvider>
                    <BottomSheetModalProvider>
                      <StatusBar animated={true} barStyle="default" />
                      <NavigationContainer>
                        <MainNav />
                      </NavigationContainer>
                      <Toast config={toastConfig} />
                    </BottomSheetModalProvider>
                  </PortalProvider>
                </BreadcrumbProvider>
              </AuthProvider>
            </Theme>
          </TamaguiProvider>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
}
