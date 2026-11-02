// Chạy trước mỗi file test (setupFilesAfterEnv), trước khi import component.
// Môi trường jest-expo/React Native có `window` nhưng không có
// `window.screen`; shim test-env của react-aria (được Gluestack v5 kéo vào
// qua @gluestack-ui/core) gọi Reflect.has(window.screen, 'orientation')
// và crash nếu screen là undefined. Đặt screen rỗng để shim tự gắn
// orientation lên đó — chỉ ảnh hưởng môi trường test, không chạm production.
if (typeof window !== 'undefined' && window.screen == null) {
  Object.defineProperty(window, 'screen', {
    value: {},
    configurable: true,
    writable: true,
  });
}
