import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, Square, View } from 'tamagui';
import { Paths } from '@/navigation/paths';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: 'transparent',
    },
    background: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 5,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 16,
      height: 50,
      zIndex: 5,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    tabItemFocused: {
      transform: [{ scale: 1.1 }],
    },
    centerButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
      position: 'absolute',
      bottom: 8,
    },
  });

export function CustomTabBar({ state, descriptors, navigation }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom - 15 }]}>
      <View style={styles.background}>
        <View style={styles.content}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            if (route.name === 'add-card-tab') {
              return (
                <View key={route.key} style={styles.tabItem}>
                  <TouchableOpacity
                    onPress={() => navigation.getParent()?.navigate(Paths.ADD_CARD_SCREEN)}
                    style={{ width: 70, height: 70 }}
                  >
                    <Circle
                      backgroundColor={colors.backgroundSecondary}
                      size={70}
                      elevation={4}
                      justifyContent="center"
                      alignItems="center"
                      zIndex={5}
                    >
                      <Circle backgroundColor={colors.primary} size={65} position="absolute">
                        {options.tabBarIcon?.({ focused: isFocused, color: colors.backgroundSecondary, size: 28 })}
                      </Circle>
                    </Circle>
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[styles.tabItem, isFocused && styles.tabItemFocused]}
              >
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? colors.primary : colors.textSecondary,
                  size: 20,
                })}
                {/* {isFocused && <View style={styles.dot} />} */}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
