module.exports = function (api) {
  // Cache theo env (không dùng api.cache(true) + api.env() cùng lúc:
  // babel báo "Caching has already been configured").
  api.cache.using(() => process.env.BABEL_ENV || process.env.NODE_ENV || 'development');
  const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';

  return {
    presets: [
      ['babel-preset-expo'],
      // Vòng 28: dưới Jest, preset nativewind/babel viết lại
      // import react-native -> react-native-css, làm mock TextInput của
      // jest-preset crash ở copyComponentProperties (chuỗi vòng 27).
      // Chỉ bỏ preset này ở env test; production/dev giữ nguyên.
      ...(isTest ? [] : ['nativewind/babel']),
    ],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
