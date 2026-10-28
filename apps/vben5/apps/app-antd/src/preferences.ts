import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description Tệp cấu hình dự án
 * Chỉ cần ghi đè một phần cấu hình trong dự án, những cấu hình không cần thiết không cần ghi đè, sẽ tự động dùng cấu hình mặc định
 * !!! Sau khi thay đổi cấu hình, vui lòng xóa cache, nếu không có thể không có hiệu lực
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
    defaultHomePath: '/workspace',
    enableRefreshToken: true,
    name: import.meta.env.VITE_APP_TITLE,
  },
  logo: {
    source: '/resource/img/logo.png',
  },
  theme: {
    mode: 'auto',
    radius: '0.25',
  },
  widget: {
    notification: false,
  },
});
