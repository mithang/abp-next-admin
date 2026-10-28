import type { PagedResultDto } from '@abp/core';

import type {
  OpenIddictApplicationCreateDto,
  OpenIddictApplicationDto,
  OpenIddictApplicationGetListInput,
  OpenIddictApplicationUpdateDto,
} from '../types/applications';

import { useRequest } from '@abp/request';

export function useApplicationsApi() {
  const { cancel, request } = useRequest();
  /**
   * Thêm mới ứng dụng
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu thực thể ứng dụng
   */
  function createApi(
    input: OpenIddictApplicationCreateDto,
  ): Promise<OpenIddictApplicationDto> {
    return request<OpenIddictApplicationDto>('/api/openiddict/applications', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xóa ứng dụng
   * @param id Id ứng dụng
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/openiddict/applications/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn ứng dụng
   * @param id Id ứng dụng
   * @returns Đối tượng truyền dữ liệu thực thể ứng dụng
   */
  function getApi(id: string): Promise<OpenIddictApplicationDto> {
    return request<OpenIddictApplicationDto>(
      `/api/openiddict/applications/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Cập nhật ứng dụng
   * @param id Id ứng dụng
   * @returns Đối tượng truyền dữ liệu thực thể ứng dụng
   */
  function updateApi(
    id: string,
    input: OpenIddictApplicationUpdateDto,
  ): Promise<OpenIddictApplicationDto> {
    return request<OpenIddictApplicationDto>(
      `/api/openiddict/applications/${id}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * Truy vấn danh sách phân trang ứng dụng
   * @param input Tham số lọc
   * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể ứng dụng
   */
  function getPagedListApi(
    input?: OpenIddictApplicationGetListInput,
  ): Promise<PagedResultDto<OpenIddictApplicationDto>> {
    return request<PagedResultDto<OpenIddictApplicationDto>>(
      `/api/openiddict/applications`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getPagedListApi,
    updateApi,
  };
}
