import { config } from '@tamagui/config/v3';
import { createTamagui, createFont } from 'tamagui';

const fontConfig = {
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 48,
    12: 56,
    13: 64,
    14: 72,
  },
  lineHeight: {
    1: 17,
    2: 19,
    3: 21,
    4: 23,
    5: 25,
    6: 29,
    7: 33,
    8: 37,
    9: 41,
    10: 45,
    11: 53,
    12: 61,
    13: 69,
    14: 77,
  },
};

const poppinsFont = createFont({
  family: 'Poppins',
  ...fontConfig,
  weight: {
    100: '100',
    200: '200',
    300: '300',
    400: '400',
    500: '500',
    600: '600',
    700: '700',
    800: '800',
    900: '900',
  },
  face: {
    100: { normal: 'Poppins_100Thin' },
    200: { normal: 'Poppins_200ExtraLight' },
    300: { normal: 'Poppins_300Light' },
    400: { normal: 'Poppins_400Regular' },
    500: { normal: 'Poppins_500Medium' },
    600: { normal: 'Poppins_600SemiBold' },
    700: { normal: 'Poppins_700Bold' },
    800: { normal: 'Poppins_800ExtraBold' },
    900: { normal: 'Poppins_900Black' },
  },
});

const rubikFont = createFont({
  family: 'Rubik',
  ...fontConfig,
  weight: {
    300: '300',
    400: '400',
    500: '500',
    600: '600',
    700: '700',
    800: '800',
    900: '900',
  },
  face: {
    300: { normal: 'Rubik_300Light' },
    400: { normal: 'Rubik_400Regular' },
    500: { normal: 'Rubik_500Medium' },
    600: { normal: 'Rubik_600SemiBold' },
    700: { normal: 'Rubik_700Bold' },
    800: { normal: 'Rubik_800ExtraBold' },
    900: { normal: 'Rubik_900Black' },
  },
});

const fonts = {
  heading: poppinsFont,
  body: poppinsFont,
  poppins: poppinsFont,
  rubik: rubikFont,
};

export const tamaguiConfig = createTamagui({
  ...config,
  fonts,
  defaultFont: 'body',
});

export default tamaguiConfig;
