/** Jest cho Expo: chỉ chạy test logic/API (không render native) ở vòng 1. */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  // VM này: filesystem của ~/workspace không cho chown nên jest transform cache
  // dưới TMPDIR=~/workspace/tmp lỗi EPERM; đặt cache lên tmpfs /tmp để tránh lỗi đó.
  cacheDirectory: '/tmp/jest-mobile-cache',
};
