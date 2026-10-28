import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  GetIdentityClaimTypePagedListInput,
  IdentityClaimTypeCreateDto,
  IdentityClaimTypeDto,
  IdentityClaimTypeUpdateDto,
} from '../types';

import { useRequest } from '@abp/request';

export function useClaimTypesApi() {
  const { cancel, request } = useRequest();

  /**
   * Thêm khai báo người dùng
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu thực thể khai báo người dùng
   */
  function createApi(
    input: IdentityClaimTypeCreateDto,
  ): Promise<IdentityClaimTypeDto> {
    return request<IdentityClaimTypeDto>('/api/identity/claim-types', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xóa khai báo người dùng
   * @param id Id khai báo người dùng
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/identity/claim-types/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn khai báo người dùng
   * @param id Id khai báo người dùng
   * @returns Đối tượng truyền dữ liệu thực thể khai báo người dùng
   */
  function getApi(id: string): Promise<IdentityClaimTypeDto> {
    return request<IdentityClaimTypeDto>(`/api/identity/claim-types/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Cập nhật khai báo người dùng
   * @param id Id khai báo người dùng
   * @returns Đối tượng truyền dữ liệu thực thể khai báo người dùng
   */
  function updateApi(
    id: string,
    input: IdentityClaimTypeUpdateDto,
  ): Promise<IdentityClaimTypeDto> {
    return request<IdentityClaimTypeDto>(`/api/identity/claim-types/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Truy vấn danh sách phân trang khai báo người dùng
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể khai báo người dùng
   */
  function getPagedListApi(
    input?: GetIdentityClaimTypePagedListInput,
  ): Promise<PagedResultDto<IdentityClaimTypeDto>> {
    return request<PagedResultDto<IdentityClaimTypeDto>>(
      `/api/identity/claim-types`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Lấy danh sách loại khai báo khả dụng
   */
  function getAssignableClaimsApi(): Promise<
    ListResultDto<IdentityClaimTypeDto>
  > {
    return request<ListResultDto<IdentityClaimTypeDto>>(
      `/api/identity/claim-types/actived-list`,
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
    getAssignableClaimsApi,
    getPagedListApi,
    updateApi,
  };
}
