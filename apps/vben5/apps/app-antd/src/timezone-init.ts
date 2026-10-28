import { setTimezoneHandler } from '@vben/stores';

import { useAbpStore } from '@abp/core';
import { useTimeZoneSettingsApi } from '@abp/settings';

/**
 * Khởi tạo xử lý múi giờ, lưu cài đặt múi giờ qua API
 */
export function initTimezone() {
  const abpStore = useAbpStore();
  const { getMyTimezoneApi, getTimezonesApi, updateMyTimezoneApi } =
    useTimeZoneSettingsApi();
  setTimezoneHandler({
    async getTimezone() {
      if (abpStore.application?.currentUser.isAuthenticated) {
        return await getMyTimezoneApi();
      }
      return undefined;
    },
    setTimezone(timezone: string) {
      return updateMyTimezoneApi(timezone);
    },
    async getTimezoneOptions() {
      const timezones = await getTimezonesApi();
      return timezones.map((timezone) => {
        return {
          label: timezone.name,
          value: timezone.value,
        };
      });
    },
  });
}
