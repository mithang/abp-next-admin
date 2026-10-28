import type { ListResultDto } from '@abp/core';

import type { SettingGroup, SettingsUpdateInput } from '../types';

import { useRequest } from '@abp/request';

export function useSettingsApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy cài đặt
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function getSettingsApi(): Promise<ListResultDto<SettingGroup>> {
    return request<ListResultDto<SettingGroup>>(
      `/api/v2/setting-management/settings`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Thay đổi cài đặt
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function setSettingsApi(input: SettingsUpdateInput): Promise<void> {
    return request(`/api/v2/setting-management/settings`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Lấy cài đặt toàn cục
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function getGlobalSettingsApi(): Promise<ListResultDto<SettingGroup>> {
    return request<ListResultDto<SettingGroup>>(
      `/api/setting-management/settings/by-global`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Đặt cài đặt toàn cục
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function setGlobalSettingsApi(input: SettingsUpdateInput): Promise<void> {
    return request(`/api/setting-management/settings/change-global`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Lấy cài đặt tenant
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function getTenantSettingsApi(): Promise<ListResultDto<SettingGroup>> {
    return request<ListResultDto<SettingGroup>>(
      `/api/setting-management/settings/by-current-tenant`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Đặt cài đặt tenant
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function setTenantSettingsApi(input: SettingsUpdateInput): Promise<void> {
    return request(`/api/setting-management/settings/change-current-tenant`, {
      data: input,
      method: 'PUT',
    });
  }
  /**
   * Lấy cài đặt người dùng
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function getUserSettingsApi(): Promise<ListResultDto<SettingGroup>> {
    return request<ListResultDto<SettingGroup>>(
      `/api/v2/setting-management/my-settings`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Đặt cài đặt người dùng
   * @returns Danh sách đối tượng truyền dữ liệu cài đặt
   */
  function setUserSettingsApi(input: SettingsUpdateInput): Promise<void> {
    return request(`/api/v2/setting-management/my-settings`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Gửi email kiểm tra
   * @param emailAddress Địa chỉ người nhận email
   */
  const sendTestEmailApi = (emailAddress: string) => {
    return request(`/api/setting-management/settings/send-test-email`, {
      data: {
        emailAddress,
      },
      method: 'POST',
    });
  };

  return {
    cancel,
    getSettingsApi,
    setSettingsApi,
    getGlobalSettingsApi,
    getTenantSettingsApi,
    getUserSettingsApi,
    sendTestEmailApi,
    setGlobalSettingsApi,
    setTenantSettingsApi,
    setUserSettingsApi,
  };
}
