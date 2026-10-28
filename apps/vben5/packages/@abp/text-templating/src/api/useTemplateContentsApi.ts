import type {
  TextTemplateContentDto,
  TextTemplateContentGetInput,
  TextTemplateContentUpdateDto,
  TextTemplateRestoreInput,
} from '../types/contents';

import { useRequest } from '@abp/request';

export function useTemplateContentsApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy nội dung mẫu
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu nội dung mẫu
   */
  function getApi(
    input: TextTemplateContentGetInput,
  ): Promise<TextTemplateContentDto> {
    let url = '/api/text-templating/templates/content';
    url += input.culture ? `/${input.culture}/${input.name}` : `/${input.name}`;
    return request<TextTemplateContentDto>(url, {
      method: 'GET',
    });
  }
  /**
   * Đặt lại nội dung mẫu về giá trị mặc định
   * @param name Tên mẫu
   * @param input Tham số
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa mẫu
   */
  function restoreToDefaultApi(
    name: string,
    input: TextTemplateRestoreInput,
  ): Promise<void> {
    return request(
      `/api/text-templating/templates/content/${name}/restore-to-default`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }
  /**
   * Cập nhật nội dung mẫu
   * @param name Tên mẫu
   * @param input Tham số
   * @returns Đối tượng truyền dữ liệu nội dung mẫu
   */
  function updateApi(
    name: string,
    input: TextTemplateContentUpdateDto,
  ): Promise<TextTemplateContentDto> {
    return request<TextTemplateContentDto>(
      `/api/text-templating/templates/content/${name}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  return {
    cancel,
    getApi,
    restoreToDefaultApi,
    updateApi,
  };
}
