import { TamaguiProvider, Theme, YStack, Spinner, Image } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, AppState, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import MainNav from '@/navigation/MainNav';
import AuthNav from '@/navigation/AuthNav';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { BreadcrumbProvider } from '@/context/BreadcrumbContext';
import toastConfig from '@/config/toastConfig';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ColorSchemeProvider, useAppTheme } from '@/context/ColorSchemeContext';
import { deleteToken, getToken } from '@/api/storage';
import { Colors } from '@/context/ColorSchemeContext';
import { validateToken } from '@/api/auth';
import { FullWindowOverlay } from 'react-native-screens';
import { getLoadedFonts, useFonts } from 'expo-font';

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
        const token = await getToken();
        if (token) {
          const validation = await validateToken(token);
          if (validation.valid) {
            setUser({ token, ...validation });
          } else {
            await deleteToken();
            setUser(null);
          }
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        await deleteToken();
        setUser(null);
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

const ThemedApp = () => {
  const { effectiveColorScheme } = useAppTheme();
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

  return (
    <Theme name={effectiveColorScheme === 'dark' ? 'dark' : 'light'}>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <AuthProvider>
                <NavigationContainer>
                  <BreadcrumbProvider>
                    <BottomSheetModalProvider>
                      <StatusBar
                        animated={true}
                        barStyle={effectiveColorScheme === 'dark' ? 'light-content' : 'dark-content'}
                      />
                      <Navigation />
                      <FullWindowOverlay>
                        <Toast config={toastConfig} />
                      </FullWindowOverlay>
                      <SecurityOverlay visible={showSecurityOverlay} />
                    </BottomSheetModalProvider>
                  </BreadcrumbProvider>
                </NavigationContainer>
              </AuthProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </Theme>
  );
};

const AppContent = ({ children }) => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </TamaguiProvider>
  );
};

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    // Archivo Regular Weights
    // Archivo_100Thin: require('./assets/fonts/Archivo/Archivo-Thin.ttf'),
    // Archivo_200ExtraLight: require('./assets/fonts/Archivo/Archivo-ExtraLight.ttf'),
    // Archivo_300Light: require('./assets/fonts/Archivo/Archivo-Light.ttf'),
    // Archivo_400Regular: require('./assets/fonts/Archivo/Archivo-Regular.ttf'),
    // Archivo_500Medium: require('./assets/fonts/Archivo/Archivo-Medium.ttf'),
    // Archivo_600SemiBold: require('./assets/fonts/Archivo/Archivo-SemiBold.ttf'),
    // Archivo_700Bold: require('./assets/fonts/Archivo/Archivo-Bold.ttf'),
    // Archivo_800ExtraBold: require('./assets/fonts/Archivo/Archivo-ExtraBold.ttf'),
    // Archivo_900Black: require('./assets/fonts/Archivo/Archivo-Black.ttf'),
    // // Archivo Italic
    // Archivo_900Black_Italic: require('./assets/fonts/Archivo/Archivo-BlackItalic.ttf'),
    // // Inter Regular Weights
    // Inter_100Thin: require('./assets/fonts/Inter/Inter_24pt-Thin.ttf'),
    // Inter_200ExtraLight: require('./assets/fonts/Inter/Inter_24pt-ExtraLight.ttf'),
    // Inter_300Light: require('./assets/fonts/Inter/Inter_24pt-Light.ttf'),
    // Inter_400Regular: require('./assets/fonts/Inter/Inter_24pt-Regular.ttf'),
    // Inter_500Medium: require('./assets/fonts/Inter/Inter_24pt-Medium.ttf'),
    // Inter_600SemiBold: require('./assets/fonts/Inter/Inter_24pt-SemiBold.ttf'),
    // Inter_700Bold: require('./assets/fonts/Inter/Inter_24pt-Bold.ttf'),
    // Inter_800ExtraBold: require('./assets/fonts/Inter/Inter_24pt-ExtraBold.ttf'),
    // Inter_900Black: require('./assets/fonts/Inter/Inter_24pt-Black.ttf'),
  });

  if (fontsError) console.log('Error while trying to load fonts', fontsError);
  const appLoaded = fontsLoaded && !fontsError;
  if (!appLoaded) return null;

  return (
    <AppContent>
      <ThemedApp />
    </AppContent>
  );
}
