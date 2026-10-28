import type { PagedResultDto } from '@abp/core';

import type {
  EmailMessageDto,
  EmailMessageGetListInput,
} from '../types/messages';

import { useRequest } from '@abp/request';

export function useEmailMessagesApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy danh sách phân trang tin nhắn email
   * @param {EmailMessageGetListInput} input Tham số
   * @returns {Promise<PagedResultDto<EmailMessageDto>>} Danh sách tin nhắn email
   */
  function getPagedListApi(
    input?: EmailMessageGetListInput,
  ): Promise<PagedResultDto<EmailMessageDto>> {
    return request<PagedResultDto<EmailMessageDto>>(
      '/api/platform/messages/email',
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Lấy tin nhắn email
   * @param id Id
   * @returns {EmailMessageDto} Tin nhắn email
   */
  function getApi(id: string): Promise<EmailMessageDto> {
    return request<EmailMessageDto>(`/api/platform/messages/email/${id}`, {
      method: 'GET',
    });
  }
  /**
   * Xóa tin nhắn email
   * @param id Id
   * @returns {void}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/platform/messages/email/${id}`, {
      method: 'DELETE',
    });
  }
  /**
   * Gửi tin nhắn email
   * @param id Id
   * @returns {void}
   */
  function sendApi(id: string): Promise<void> {
    return request(`/api/platform/messages/email/${id}/send`, {
      method: 'POST',
    });
  }

  return {
    cancel,
    deleteApi,
    getApi,
    getPagedListApi,
    sendApi,
  };
}
