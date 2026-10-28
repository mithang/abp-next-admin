import type { PagedResultDto } from '@abp/core';

import type {
  OpenIddictTokenDto,
  OpenIddictTokenGetListInput,
} from '../types/tokens';

import { useRequest } from '@abp/request';

export function useTokensApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa mã thông báo
   * @param id Id mã thông báo
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/openiddict/tokens/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn mã thông báo
   * @param id Id mã thông báo
   * @returns Đối tượng truyền dữ liệu thực thể mã thông báo
   */
  function getApi(id: string): Promise<OpenIddictTokenDto> {
    return request<OpenIddictTokenDto>(`/api/openiddict/tokens/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn danh sách phân trang mã thông báo
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể mã thông báo
   */
  function getPagedListApi(
    input?: OpenIddictTokenGetListInput,
  ): Promise<PagedResultDto<OpenIddictTokenDto>> {
    return request<PagedResultDto<OpenIddictTokenDto>>(
      `/api/openiddict/tokens`,
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
