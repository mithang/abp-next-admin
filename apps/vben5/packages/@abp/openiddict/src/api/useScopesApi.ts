import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  OpenIddictScopeCreateDto,
  OpenIddictScopeDto,
  OpenIddictScopeGetListInput,
  OpenIddictScopeUpdateDto,
} from '../types/scopes';

import { useRequest } from '@abp/request';

export function useScopesApi() {
  const { cancel, request } = useRequest();
  /**
   * Thêm phạm vi
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu thực thể phạm vi
   */
  function createApi(
    input: OpenIddictScopeCreateDto,
  ): Promise<OpenIddictScopeDto> {
    return request<OpenIddictScopeDto>('/api/openiddict/scopes', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xóa phạm vi
   * @param id Id phạm vi
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/openiddict/scopes/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn phạm vi
   * @param id Id phạm vi
   * @returns Đối tượng truyền dữ liệu thực thể phạm vi
   */
  function getApi(id: string): Promise<OpenIddictScopeDto> {
    return request<OpenIddictScopeDto>(`/api/openiddict/scopes/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Cập nhật phạm vi
   * @param id Id phạm vi
   * @returns Đối tượng truyền dữ liệu thực thể phạm vi
   */
  function updateApi(
    id: string,
    input: OpenIddictScopeUpdateDto,
  ): Promise<OpenIddictScopeDto> {
    return request<OpenIddictScopeDto>(`/api/openiddict/scopes/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Truy vấn danh sách phân trang phạm vi
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể phạm vi
   */
  function getPagedListApi(
    input?: OpenIddictScopeGetListInput,
  ): Promise<PagedResultDto<OpenIddictScopeDto>> {
    return request<PagedResultDto<OpenIddictScopeDto>>(
      `/api/openiddict/scopes`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Truy vấn danh sách phạm vi khả dụng
   * @returns Danh sách đối tượng truyền dữ liệu thực thể phạm vi khả dụng
   */
  function getAssignableScopesApi(): Promise<
    ListResultDto<OpenIddictScopeDto>
  > {
    return request<ListResultDto<OpenIddictScopeDto>>(
      `/api/openiddict/scopes/assignable-scopes`,
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
    getAssignableScopesApi,
    getPagedListApi,
    updateApi,
  };
}
