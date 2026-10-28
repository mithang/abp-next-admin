import type { PagedResultDto } from '@abp/core';

import type {
  OpenIddictAuthorizationDto,
  OpenIddictAuthorizationGetListInput,
} from '../types/authorizations';

import { useRequest } from '@abp/request';

export function useAuthorizationsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa ủy quyền
   * @param id Id ủy quyền
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/openiddict/authorizations/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn ủy quyền
   * @param id Id ủy quyền
   * @returns Đối tượng truyền dữ liệu thực thể ủy quyền
   */
  function getApi(id: string): Promise<OpenIddictAuthorizationDto> {
    return request<OpenIddictAuthorizationDto>(
      `/api/openiddict/authorizations/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách phân trang ủy quyền
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể ủy quyền
   */
  function getPagedListApi(
    input?: OpenIddictAuthorizationGetListInput,
  ): Promise<PagedResultDto<OpenIddictAuthorizationDto>> {
    return request<PagedResultDto<OpenIddictAuthorizationDto>>(
      `/api/openiddict/authorizations`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  return {
    cancel,
    deleteApi,
    getApi,
    getPagedListApi,
  };
}
