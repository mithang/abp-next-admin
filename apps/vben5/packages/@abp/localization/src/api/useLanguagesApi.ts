import type { PagedResultDto } from '@abp/core';

import type {
  LanguageCreateDto,
  LanguageDto,
  LanguageGetPagedListInput,
  LanguageUpdateDto,
} from '../types/languages';

import { useRequest } from '@abp/request';

export function useLanguagesApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn danh sách phân trang ngôn ngữ
   * @param input Tham số
   * @returns Danh sách ngôn ngữ
   */
  function getPagedListApi(
    input?: LanguageGetPagedListInput,
  ): Promise<PagedResultDto<LanguageDto>> {
    return request<PagedResultDto<LanguageDto>>('/api/localization/languages', {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Truy vấnngôn ngữ
   * @param name Tên ngôn ngữ
   * @returns Ngôn ngữ được truy vấn
   */
  function getApi(name: string): Promise<LanguageDto> {
    return request<LanguageDto>(`/api/localization/languages/${name}`, {
      method: 'GET',
    });
  }

  /**
   * Xóa ngôn ngữ
   * @param name Tên ngôn ngữ
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/localization/languages/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Tạo ngôn ngữ
   * @param input Tham số
   * @returns Ngôn ngữ đã tạo
   */
  function createApi(input: LanguageCreateDto): Promise<LanguageDto> {
    return request<LanguageDto>(`/api/localization/languages`, {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Chỉnh sửa ngôn ngữ
   * @param name Tên ngôn ngữ
   * @param input Tham số
   * @returns Ngôn ngữ đã chỉnh sửa
   */
  function updateApi(
    name: string,
    input: LanguageUpdateDto,
  ): Promise<LanguageDto> {
    return request<LanguageDto>(`/api/localization/languages/${name}`, {
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
