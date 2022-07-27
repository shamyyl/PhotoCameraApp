/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const {getDefaultConfig} = require('metro-config');
const {resolver: defaultResolver} = getDefaultConfig.getDefaultValues();

console.log({RN_SRC_EXT: process.env.RN_SRC_EXT});

module.exports = {
  resolver: {
    ...defaultResolver,
    sourceExts: [
      process.env.RN_SRC_EXT && process.env.RN_SRC_EXT.split(','),
      ...defaultResolver.sourceExts,
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
