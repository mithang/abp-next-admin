import type { PagedResultDto } from '@abp/core';

import type {
  EditionCreateDto,
  EditionDto,
  EditionUpdateDto,
  GetEditionPagedListInput,
} from '../types';

import { useRequest } from '@abp/request';

export function useEditionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Tạo phiên bản
   * @param {EditionCreateDto} input Tham số
   * @returns Phiên bản đã tạo
   */
  function createApi(input: EditionCreateDto): Promise<EditionDto> {
    return request<EditionDto>('/api/saas/editions', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Chỉnh sửa phiên bản
   * @param {string} id Tham số
   * @param {EditionUpdateDto} input Tham số
   * @returns Phiên bản đã chỉnh sửa
   */
  function updateApi(id: string, input: EditionUpdateDto): Promise<EditionDto> {
    return request<EditionDto>(`/api/saas/editions/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Truy vấn phiên bản
   * @param {string} id Id
   * @returns Phiên bản đã truy vấn
   */
  function getApi(id: string): Promise<EditionDto> {
    return request<EditionDto>(`/api/saas/editions/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Xóa phiên bản
   * @param {string} id Id
   * @returns {void}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/saas/editions/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn danh sách phân trang phiên bản
   * @param {GetEditionPagedListInput} input Tham số
   * @returns {void}
   */
  function getPagedListApi(
    input?: GetEditionPagedListInput,
  ): Promise<PagedResultDto<EditionDto>> {
    return request<PagedResultDto<EditionDto>>(`/api/saas/editions`, {
      method: 'GET',
      params: input,
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
