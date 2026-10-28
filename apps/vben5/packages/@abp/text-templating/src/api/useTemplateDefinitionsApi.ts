import type { ListResultDto } from '@abp/core';

import type {
  TextTemplateDefinitionCreateDto,
  TextTemplateDefinitionDto,
  TextTemplateDefinitionGetListInput,
  TextTemplateDefinitionUpdateDto,
} from '../types/definitions';

import { useRequest } from '@abp/request';

export function useTemplateDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Thêm mới định nghĩa mẫu
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu định nghĩa mẫu
   */
  function createApi(
    input: TextTemplateDefinitionCreateDto,
  ): Promise<TextTemplateDefinitionDto> {
    return request<TextTemplateDefinitionDto>(
      '/api/text-templating/template/definitions',
      {
        data: input,
        method: 'POST',
      },
    );
  }
  /**
   * Xóa định nghĩa mẫu
   * @param name Tên mẫu
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/text-templating/template/definitions/${name}`, {
      method: 'DELETE',
    });
  }
  /**
   * Lấy định nghĩa mẫu
   * @param name Tên mẫu
   * @returns Đối tượng truyền dữ liệu định nghĩa mẫu
   */
  function getApi(name: string): Promise<TextTemplateDefinitionDto> {
    return request<TextTemplateDefinitionDto>(
      `/api/text-templating/template/definitions/${name}`,
      {
        method: 'GET',
      },
    );
  }
  /**
   * Lấy danh sách định nghĩa mẫu
   * @param input Tham số lọc
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa mẫu
   */
  function getListApi(
    input?: TextTemplateDefinitionGetListInput,
  ): Promise<ListResultDto<TextTemplateDefinitionDto>> {
    return request<ListResultDto<TextTemplateDefinitionDto>>(
      `/api/text-templating/template/definitions/${name}`,
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Cập nhật định nghĩa mẫu
   * @param name Tên mẫu
   * @returns Đối tượng truyền dữ liệu định nghĩa mẫu
   */
  function updateApi(
    name: string,
    input: TextTemplateDefinitionUpdateDto,
  ): Promise<TextTemplateDefinitionDto> {
    return request<TextTemplateDefinitionDto>(
      `/api/text-templating/template/definitions/${name}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getListApi,
    updateApi,
  };
}
