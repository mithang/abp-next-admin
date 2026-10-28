import type {
  GetPermissionGrantedWithProviderListResultDto,
  PermissionProvider,
  PermissionResultDto,
  PermissionsUpdateDto,
} from '../types/permissions';

import { useRequest } from '@abp/request';

export function usePermissionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn quyền
   * @param provider
   * @returns Đối tượng truyền dữ liệu thực thể quyền
   */
  function getApi(provider: PermissionProvider): Promise<PermissionResultDto> {
    return request<PermissionResultDto>(
      `/api/permission-management/permissions`,
      {
        method: 'GET',
        params: provider,
      },
    );
  }

  /**
   * Cập nhật quyền
   * @param provider
   * @param input
   */
  function updateApi(
    provider: PermissionProvider,
    input: PermissionsUpdateDto,
  ): Promise<void> {
    return request(`/api/permission-management/permissions`, {
      data: input,
      method: 'PUT',
      params: provider,
    });
  }

  /**
   * Lấy đối tượng đã được cấp quyền
   * @param permissionName Tên quyền
   * @param providerName Nhà cung cấp ủy quyền
   * @returns Danh sách quyền đã được cấp theo nhà cung cấp
   */
  function getGrantedByProviderApi(
    permissionName: string,
    providerName: string,
  ): Promise<GetPermissionGrantedWithProviderListResultDto> {
    return request<GetPermissionGrantedWithProviderListResultDto>(
      `/api/permission-management/permissions/granted/by-provider`,
      {
        method: 'GET',
        params: {
          permissionName,
          providerName,
        },
      },
    );
  }

  return {
    cancel,
    getApi,
    updateApi,
    getGrantedByProviderApi,
  };
}
