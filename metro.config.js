const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add additional module paths for Tamagui
config.resolver.nodeModulesPaths = [...config.resolver.nodeModulesPaths, './node_modules'];

// Tamagui needs these to work properly
config.transformer.minifierPath = require.resolve('metro-minify-terser');
config.transformer.babelTransformerPath = require.resolve('react-native-css-transformer');

module.exports = config;
