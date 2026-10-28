import type { ListResultDto } from '@abp/core';

import type {
  DeleteTextInput,
  GetTextByKeyInput,
  GetTextsInput,
  SetTextInput,
  TextDifferenceDto,
  TextDto,
} from '../types/texts';

import { useRequest } from '@abp/request';

export function useTextsApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn danh sách văn bản
   * @param input Tham số
   * @returns Danh sách văn bản
   */
  function getListApi(
    input: GetTextsInput,
  ): Promise<ListResultDto<TextDifferenceDto>> {
    return request<ListResultDto<TextDifferenceDto>>(
      '/api/localization/texts',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Truy vấn văn bản
   * @param input Tham số
   * @returns Văn bản được truy vấn
   */
  function getApi(input: GetTextByKeyInput): Promise<TextDto> {
    return request<TextDto>('/api/localization/texts/by-key', {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Đặt văn bản
   * @param input Tham số
   */
  function setApi(input: SetTextInput): Promise<void> {
    return request('/api/localization/texts', {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Xóa văn bản
   * @param input Tham số
   */
  function deleteApi(input: DeleteTextInput): Promise<void> {
    return request('/api/localization/texts', {
      data: input,
      method: 'DELETE',
    });
  }

  return {
    cancel,
    deleteApi,
    getApi,
    getListApi,
    setApi,
  };
}
