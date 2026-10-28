import type { NameValue } from '@abp/core';

import { useRequest } from '@abp/request';

export function useTimeZoneSettingsApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn cài đặt múi giờ hệ thống
   * @returns Múi giờ hệ thống
   */
  function getApi(): Promise<string> {
    return request<string>(`/api/setting-management/timezone`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn cài đặt múi giờ của người dùng hiện tại
   * @returns Múi giờ người dùng
   */
  function getMyTimezoneApi(): Promise<string> {
    return request<string>(`/api/setting-management/timezone/my-timezone`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn danh sách múi giờ
   * @returns Danh sách múi giờ
   */
  function getTimezonesApi(): Promise<NameValue<string>[]> {
    return request<NameValue<string>[]>(
      `/api/setting-management/timezone/timezones`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Cập nhật múi giờ
   * @param timezone Tên múi giờ
   */
  function updateApi(timezone: string): Promise<void> {
    return request(`/api/setting-management/timezone?timezone=${timezone}`, {
      method: 'POST',
    });
  }

  /**
   * Cập nhật múi giờ của người dùng hiện tại
   * @param timezone Tên múi giờ
   */
  function updateMyTimezoneApi(timezone: string): Promise<void> {
    return request(
      `/api/setting-management/timezone/my-timezone?timezone=${timezone}`,
      {
        method: 'POST',
      },
    );
  }

  return {
    cancel,
    getApi,
    getMyTimezoneApi,
    getTimezonesApi,
    updateMyTimezoneApi,
    updateApi,
  };
}
