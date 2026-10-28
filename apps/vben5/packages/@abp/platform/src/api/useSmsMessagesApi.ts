import type { PagedResultDto } from '@abp/core';

import type { SmsMessageDto, SmsMessageGetListInput } from '../types';

import { useRequest } from '@abp/request';

export function useSmsMessagesApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy danh sách phân trang tin nhắn SMS
   * @param {EmailMessageGetListInput} input Tham số
   * @returns {Promise<PagedResultDto<EmailMessageDto>>} Danh sách tin nhắn SMS
   */
  function getPagedListApi(
    input?: SmsMessageGetListInput,
  ): Promise<PagedResultDto<SmsMessageDto>> {
    return request<PagedResultDto<SmsMessageDto>>(
      '/api/platform/messages/sms',
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Lấy tin nhắn SMS
   * @param id Id
   * @returns {SmsMessageDto} Tin nhắn SMS
   */
  function getApi(id: string): Promise<SmsMessageDto> {
    return request<SmsMessageDto>(`/api/platform/messages/sms/${id}`, {
      method: 'GET',
    });
  }
  /**
   * Xóa tin nhắn SMS
   * @param id Id
   * @returns {void}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/platform/messages/sms/${id}`, {
      method: 'DELETE',
    });
  }
  /**
   * Gửi tin nhắn SMS
   * @param id Id
   * @returns {void}
   */
  function sendApi(id: string): Promise<void> {
    return request(`/api/platform/messages/sms/${id}/send`, {
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
