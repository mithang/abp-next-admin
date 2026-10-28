import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description Tệp cấu hình dự án
 * Chỉ cần ghi đè một phần cấu hình trong dự án, các cấu hình không cần thiết không cần ghi đè, sẽ tự động dùng cấu hình mặc định
 * !!! Sau khi thay đổi cấu hình hãy xóa cache, nếu không có thể không có hiệu lực
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
  },
});
