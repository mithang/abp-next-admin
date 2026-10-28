import type { ListResultDto } from '@abp/core';

import type {
  PermissionGroupDefinitionCreateDto,
  PermissionGroupDefinitionDto,
  PermissionGroupDefinitionGetListInput,
  PermissionGroupDefinitionUpdateDto,
} from '../types/groups';

import { useRequest } from '@abp/request';

export function usePermissionGroupDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa quyền
   * @param name Tên quyền
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/permission-management/definitions/groups/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa quyền
   * @param name Tên quyền
   * @returns Đối tượng truyền dữ liệu định nghĩa quyền
   */
  function getApi(name: string): Promise<PermissionGroupDefinitionDto> {
    return request<PermissionGroupDefinitionDto>(
      `/api/permission-management/definitions/groups/${name}`,
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
    input?: PermissionGroupDefinitionGetListInput,
  ): Promise<ListResultDto<PermissionGroupDefinitionDto>> {
    return request<ListResultDto<PermissionGroupDefinitionDto>>(
      `/api/permission-management/definitions/groups`,
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
    input: PermissionGroupDefinitionCreateDto,
  ): Promise<PermissionGroupDefinitionDto> {
    return request<PermissionGroupDefinitionDto>(
      '/api/permission-management/definitions/groups',
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
    input: PermissionGroupDefinitionUpdateDto,
  ): Promise<PermissionGroupDefinitionDto> {
    return request<PermissionGroupDefinitionDto>(
      `/api/permission-management/definitions/groups/${name}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getListApi,
    updateApi,
  };
}
