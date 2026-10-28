import type { PagedResultDto } from '@abp/core';

import type {
  ResourceCreateDto,
  ResourceDto,
  ResourceGetPagedListInput,
  ResourceUpdateDto,
} from '../types/resources';

import { useRequest } from '@abp/request';

export function useResourcesApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn danh sách phân trang tài nguyên
   * @param input Tham số
   * @returns Danh sách tài nguyên
   */
  function getPagedListApi(
    input?: ResourceGetPagedListInput,
  ): Promise<PagedResultDto<ResourceDto>> {
    return request<PagedResultDto<ResourceDto>>('/api/localization/resources', {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Truy vấntài nguyên
   * @param name Tên tài nguyên
   * @returns Tài nguyên được truy vấn
   */
  function getApi(name: string): Promise<ResourceDto> {
    return request<ResourceDto>(`/api/localization/resources/${name}`, {
      method: 'GET',
    });
  }

  /**
   * Xóa tài nguyên
   * @param name Tên tài nguyên
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/localization/resources/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Tạo tài nguyên
   * @param input Tham số
   * @returns Tài nguyên đã tạo
   */
  function createApi(input: ResourceCreateDto): Promise<ResourceDto> {
    return request<ResourceDto>(`/api/localization/resources`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Chỉnh sửa tài nguyên
   * @param name Tên tài nguyên
   * @param input Tham số
   * @returns Tài nguyên đã chỉnh sửa
   */
  function updateApi(
    name: string,
    input: ResourceUpdateDto,
  ): Promise<ResourceDto> {
    return request<ResourceDto>(`/api/localization/resources/${name}`, {
      data: input,
      method: 'PUT',
    });
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
