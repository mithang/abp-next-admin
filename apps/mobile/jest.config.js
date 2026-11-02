/** Jest cho Expo: test logic/API + component (RNTL, từ vòng 27). */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  // VM này: filesystem của ~/workspace không cho chown nên jest transform cache
  // dưới TMPDIR=~/workspace/tmp lỗi EPERM; đặt cache lên tmpfs /tmp để tránh lỗi đó.
  cacheDirectory: '/tmp/jest-mobile-cache',
  // Alias '@' giống babel module-resolver (jest không đọc babel plugin).
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Jest-only: react-dom là dep web-only của react-aria, không có trong
    // app RN (xem jest.react-dom-stub.js). Không chạm production.
    '^react-dom$': '<rootDir>/jest.react-dom-stub.js',
  },
  // jest-expo mặc định không transform @gluestack-ui (ESM) nên render
  // component Gluestack v5 lỗi "Must use import to load ES Module".
  // Mở rộng danh sách transform cho Gluestack + deps styling/aria của nó,
  // giữ nguyên 2 pattern loại trừ reanimated/babel-preset của jest-expo.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|@gluestack-ui|react-native-css|tailwind-variants|@legendapp|react-aria|react-stately|@react-aria|@react-stately))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
};
