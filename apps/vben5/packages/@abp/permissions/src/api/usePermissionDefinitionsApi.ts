import type { ListResultDto, NameValue } from '@abp/core';

import type {
  PermissionDefinitionCreateDto,
  PermissionDefinitionDto,
  PermissionDefinitionGetListInput,
  PermissionDefinitionUpdateDto,
} from '../types/definitions';

import { useRequest } from '@abp/request';

export function usePermissionDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa quyền
   * @param name Tên quyền
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/permission-management/definitions/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa quyền
   * @param name Tên quyền
   * @returns Đối tượng truyền dữ liệu định nghĩa quyền
   */
  function getApi(name: string): Promise<PermissionDefinitionDto> {
    return request<PermissionDefinitionDto>(
      `/api/permission-management/definitions/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách định nghĩa quyền
   * @param input Điều kiện lọc quyền
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa quyền
   */
  function getListApi(
    input?: PermissionDefinitionGetListInput,
  ): Promise<ListResultDto<PermissionDefinitionDto>> {
    return request<ListResultDto<PermissionDefinitionDto>>(
      `/api/permission-management/definitions`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa quyền
   * @param input Tham số định nghĩa quyền
   * @returns Đối tượng truyền dữ liệu định nghĩa quyền
   */
  function createApi(
    input: PermissionDefinitionCreateDto,
  ): Promise<PermissionDefinitionDto> {
    return request<PermissionDefinitionDto>(
      '/api/permission-management/definitions',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Cập nhật định nghĩa quyền
   * @param name Tên quyền
   * @param input Tham số định nghĩa quyền
   * @returns Đối tượng truyền dữ liệu định nghĩa quyền
   */
  function updateApi(
    name: string,
    input: PermissionDefinitionUpdateDto,
  ): Promise<PermissionDefinitionDto> {
    return request<PermissionDefinitionDto>(
      `/api/permission-management/definitions/${name}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * Lấy danh sách nhà cung cấp quyền khả dụng
   * @returns {Promise<ListResultDto<NameValue<string>>>} Danh sách nhà cung cấp quyền
   */
  function getAssignableProvidersApi(): Promise<
    ListResultDto<NameValue<string>>
  > {
    return request<ListResultDto<NameValue<string>>>(
      '/api/permission-management/definitions/assignable-providers',
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
