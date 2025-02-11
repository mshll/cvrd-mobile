import { TamaguiProvider, Theme, YStack, Spinner, Image } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, useColorScheme, AppState, Animated } from 'react-native';
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
import { ColorSchemeProvider } from '@/context/ColorSchemeContext';
import { getToken } from '@/api/storage';
import { Colors } from '@/config/colors';

const queryClient = new QueryClient();

// Security Overlay Component
const SecurityOverlay = ({ visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIsRendered(false);
      });
    }
  }, [visible]);

  if (!isRendered) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeAnim,
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        }}
      >
        <Image
          source={require('./assets/logo-primary.png')}
          style={{ width: 200, height: 80, resizeMode: 'contain' }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const LoadingScreen = () => (
  <YStack f={1} ai="center" jc="center" backgroundColor="$background">
    <Spinner size="large" color="$color" />
  </YStack>
);

const Navigation = () => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // await deleteToken();
        const token = await getToken();
        if (token) {
          setUser(token);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (isLoading) return <LoadingScreen />;
  if (!user) return <AuthNav />;
  return <MainNav />;
};

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
  const [showSecurityOverlay, setShowSecurityOverlay] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('AppState', nextAppState);
      setShowSecurityOverlay(nextAppState !== 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ColorSchemeProvider>
        <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
          <QueryClientProvider client={queryClient}>
            <ActionSheetProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <AuthProvider>
                    <NavigationContainer>
                      <BreadcrumbProvider>
                        <PortalProvider>
                          <BottomSheetModalProvider>
                            <StatusBar animated={true} barStyle="default" />
                            <Navigation />
                            <Toast config={toastConfig} />
                            <SecurityOverlay visible={showSecurityOverlay} />
                          </BottomSheetModalProvider>
                        </PortalProvider>
                      </BreadcrumbProvider>
                    </NavigationContainer>
                  </AuthProvider>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </ActionSheetProvider>
          </QueryClientProvider>
        </Theme>
      </ColorSchemeProvider>
    </TamaguiProvider>
  );
}
