import type { ListResultDto } from '@abp/core';

import type {
  IdentityUserDto,
  UserLookupCountInput,
  UserLookupSearchInput,
} from '../types/users';

import { useRequest } from '@abp/request';

export function useUserLookupApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn người dùng theo id
   * @param id Id người dùng
   * @returns Đối tượng truyền dữ liệu thực thể người dùng
   */
  function findByIdApi(id: string): Promise<IdentityUserDto> {
    return request<IdentityUserDto>(`/api/identity/users/lookup/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn người dùng theo tên người dùng
   * @param userName Tên người dùng
   * @returns Đối tượng truyền dữ liệu thực thể người dùng
   */
  function findByUserNameApi(userName: string): Promise<IdentityUserDto> {
    return request<IdentityUserDto>(
      `/api/identity/users/lookup/by-username/${userName}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Tìm kiếm danh sách người dùng
   * @param input Điều kiện lọc tìm kiếm
   * @returns Danh sách đối tượng truyền dữ liệu thực thể người dùng
   */
  function searchApi(
    input?: UserLookupSearchInput,
  ): Promise<ListResultDto<IdentityUserDto>> {
    return request<ListResultDto<IdentityUserDto>>(
      `/api/identity/users/lookup/search`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tìm kiếm số lượng người dùng
   * @param input Điều kiện lọc tìm kiếm
   */
  function countApi(input?: UserLookupCountInput): Promise<number> {
    return request<number>(`/api/identity/users/lookup/count`, {
      method: 'GET',
      params: input,
    });
  }

  return {
    cancel,
    countApi,
    findByIdApi,
    findByUserNameApi,
    searchApi,
  };
}
