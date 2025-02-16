import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Colors, useAppTheme } from '../context/ColorSchemeContext';

const INTERVAL = 5000; // 5 seconds
const LOGO_COLORS = [Colors.cards.green, Colors.cards.blue, Colors.cards.pink, Colors.cards.red];

export function ColorChangingLogo({ routeName }) {
  const [colorIndex, setColorIndex] = useState(0);
  const { effectiveColorScheme } = useAppTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % LOGO_COLORS.length);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Base logo part 1 (static black/white based on theme) */}
      <Image
        source={
          effectiveColorScheme === 'dark' ? require('@/../assets/logo-p1.png') : require('@/../assets/logo-p1-dark.png')
        }
        style={styles.image}
      />
      {/* Logo part 2 (color changing) */}
      <Image
        source={require('@/../assets/logo-p2.png')}
        style={[
          styles.overlayImage,
          {
            tintColor: LOGO_COLORS[colorIndex],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 24,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
