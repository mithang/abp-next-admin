import type { ListResultDto } from '@abp/core';

import type {
  UserFavoriteMenuCreateDto,
  UserFavoriteMenuDto,
} from '../types/favorites';

import { useRequest } from '@abp/request';

export function useMyFavoriteMenusApi() {
  const { cancel, request } = useRequest();

  /**
   * Thêm menu thường dùng
   * @param input Tham số
   * @returns Menu thường dùng
   */
  function createApi(
    input: UserFavoriteMenuCreateDto,
  ): Promise<UserFavoriteMenuDto> {
    return request<UserFavoriteMenuDto>(
      `/api/platform/menus/favorites/my-favorite-menus`,
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Xóa menu thường dùng
   * @param id Id menu
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/platform/menus/favorites/my-favorite-menus/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Lấy danh sách menu thường dùng
   * @param framework Khung giao diện người dùng
   * @returns Danh sách menu
   */
  function getListApi(
    framework?: string,
  ): Promise<ListResultDto<UserFavoriteMenuDto>> {
    return request<ListResultDto<UserFavoriteMenuDto>>(
      `/api/platform/menus/favorites/my-favorite-menus?framework=${framework}`,
      {
        method: 'GET',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getListApi,
  };
}
