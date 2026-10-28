import type { ListResultDto } from '@abp/core';
import type { SettingGroup } from '@abp/settings';

import { useRequest } from '@abp/request';

export function useWechatSettingsApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy cài đặt toàn cục
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function getGlobalSettingsApi(): Promise<ListResultDto<SettingGroup>> {
    return request<ListResultDto<SettingGroup>>(
      `/api/wechat/setting-management/by-global`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Lấy cài đặt tenant
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function getTenantSettingsApi(): Promise<ListResultDto<SettingGroup>> {
    return request<ListResultDto<SettingGroup>>(
      `/api/wechat/setting-management/by-current-tenant`,
      {
        method: 'GET',
      },
    );
  }

  return {
    cancel,
    getGlobalSettingsApi,
    getTenantSettingsApi,
  };
}
