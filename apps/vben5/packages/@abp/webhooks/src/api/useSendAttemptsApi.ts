import type { PagedResultDto } from '@abp/core';

import type {
  WebhookSendRecordDeleteManyInput,
  WebhookSendRecordDto,
  WebhookSendRecordGetListInput,
  WebhookSendRecordResendManyInput,
} from '../types/sendAttempts';

import { useRequest } from '@abp/request';

export function useSendAttemptsApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn bản ghi gửi
   * @param id Id bản ghi
   * @returns Dto bản ghi gửi
   */
  function getApi(id: string): Promise<WebhookSendRecordDto> {
    return request<WebhookSendRecordDto>(`/api/webhooks/send-attempts/${id}`, {
      method: 'GET',
    });
  }
  /**
   * Xóa bản ghi gửi
   * @param id Id bản ghi
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/webhooks/send-attempts/${id}`, {
      method: 'DELETE',
    });
  }
  /**
   * Xóa hàng loạt bản ghi gửi
   * @param input Tham số
   */
  function bulkDeleteApi(
    input: WebhookSendRecordDeleteManyInput,
  ): Promise<void> {
    return request(`/api/webhooks/send-attempts/delete-many`, {
      data: input,
      method: 'DELETE',
    });
  }
  /**
   * Truy vấn danh sách phân trang bản ghi gửi
   * @param input Tham số lọc
   * @returns Danh sách phân trang Dto bản ghi gửi
   */
  function getPagedListApi(
    input: WebhookSendRecordGetListInput,
  ): Promise<PagedResultDto<WebhookSendRecordDto>> {
    return request<PagedResultDto<WebhookSendRecordDto>>(
      `/api/webhooks/send-attempts`,
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Gửi lại
   * @param id Id bản ghi
   */
  function reSendApi(id: string): Promise<void> {
    return request(`/api/webhooks/send-attempts/${id}/resend`, {
      method: 'POST',
    });
  }
  /**
   * Gửi lại hàng loạt
   * @param input Tham số
   */
  function bulkReSendApi(
    input: WebhookSendRecordResendManyInput,
  ): Promise<void> {
    return request(`/api/webhooks/send-attempts/resend-many`, {
      data: input,
      method: 'POST',
    });
  }

  return {
    bulkDeleteApi,
    bulkReSendApi,
    cancel,
    deleteApi,
    getApi,
    getPagedListApi,
    reSendApi,
  };
}
