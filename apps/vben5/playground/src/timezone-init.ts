import { setTimezoneHandler } from '@vben/stores';

import { getTimezoneApi, getTimezoneOptionsApi, setTimezoneApi } from '#/api';

/**
 * Khởi tạo xử lý múi giờ, lưu cài đặt múi giờ qua API
 */
export function initTimezone() {
  setTimezoneHandler({
    getTimezone() {
      return getTimezoneApi();
    },
    setTimezone(timezone: string) {
      return setTimezoneApi(timezone);
    },
    getTimezoneOptions() {
      return getTimezoneOptionsApi();
    },
  });
}
