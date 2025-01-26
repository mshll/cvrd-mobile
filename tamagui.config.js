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

const interFont = createFont({
  family: 'Inter',
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
    100: { normal: 'Inter_100Thin' },
    200: { normal: 'Inter_200ExtraLight' },
    300: { normal: 'Inter_300Light' },
    400: { normal: 'Inter_400Regular' },
    500: { normal: 'Inter_500Medium' },
    600: { normal: 'Inter_600SemiBold' },
    700: { normal: 'Inter_700Bold' },
    800: { normal: 'Inter_800ExtraBold' },
    900: { normal: 'Inter_900Black' },
  },
});

const archivoFont = createFont({
  family: 'Archivo',
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
    100: { normal: 'Archivo_100Thin' },
    200: { normal: 'Archivo_200ExtraLight' },
    300: { normal: 'Archivo_300Light' },
    400: { normal: 'Archivo_400Regular' },
    500: { normal: 'Archivo_500Medium' },
    600: { normal: 'Archivo_600SemiBold' },
    700: { normal: 'Archivo_700Bold' },
    800: { normal: 'Archivo_800ExtraBold' },
    900: { normal: 'Archivo_900Black' },
  },
});

const archivoBlackFont = createFont({
  family: 'Archivo Black',
  ...fontConfig,
  weight: {
    900: '900',
  },
  face: {
    900: { normal: 'Archivo_900Black' },
  },
});

const fonts = {
  heading: archivoFont,
  body: interFont,
  inter: interFont,
  archivo: archivoFont,
  archivoBlack: archivoBlackFont,
};

export const tamaguiConfig = createTamagui({
  ...config,
  fonts,
  defaultFont: 'body',
});

export default tamaguiConfig;
