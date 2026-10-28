import type { ListResultDto, NameValue } from '@abp/core';

import type {
  SettingDefinitionCreateDto,
  SettingDefinitionDto,
  SettingDefinitionGetListInput,
  SettingDefinitionUpdateDto,
} from '../types';

import { useRequest } from '@abp/request';

export function useDefinitionsApi() {
  const { cancel, request } = useRequest();
  /**
   * Xóa định nghĩa cài đặt
   * @param name Tên cài đặt
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/setting-management/settings/definitions/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa cài đặt
   * @param name Tên cài đặt
   * @returns Đối tượng truyền dữ liệu định nghĩa cài đặt
   */
  function getApi(name: string): Promise<SettingDefinitionDto> {
    return request<SettingDefinitionDto>(
      `/api/setting-management/settings/definitions/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách định nghĩa cài đặt
   * @param input Điều kiện lọc cài đặt
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa cài đặt
   */
  function getListApi(
    input?: SettingDefinitionGetListInput,
  ): Promise<ListResultDto<SettingDefinitionDto>> {
    return request<ListResultDto<SettingDefinitionDto>>(
      `/api/setting-management/settings/definitions`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa cài đặt
   * @param input Tham số định nghĩa cài đặt
   * @returns Đối tượng truyền dữ liệu định nghĩa cài đặt
   */
  function createApi(
    input: SettingDefinitionCreateDto,
  ): Promise<SettingDefinitionDto> {
    return request<SettingDefinitionDto>(
      '/api/setting-management/settings/definitions',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Cập nhật định nghĩa cài đặt
   * @param name Tên cài đặt
   * @param input Tham số định nghĩa cài đặt
   * @returns Đối tượng truyền dữ liệu định nghĩa cài đặt
   */
  function updateApi(
    name: string,
    input: SettingDefinitionUpdateDto,
  ): Promise<SettingDefinitionDto> {
    return request<SettingDefinitionDto>(
      `/api/setting-management/settings/definitions/${name}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * Lấy danh sách nhà cung cấp cài đặt khả dụng
   * @returns {Promise<ListResultDto<NameValue<string>>>} Danh sách nhà cung cấp cài đặt
   */
  function getAssignableProvidersApi(): Promise<
    ListResultDto<NameValue<string>>
  > {
    return request<ListResultDto<NameValue<string>>>(
      '/api/setting-management/settings/definitions/assignable-providers',
      {
        method: 'GET',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getAssignableProvidersApi,
    getListApi,
    updateApi,
  };
}
