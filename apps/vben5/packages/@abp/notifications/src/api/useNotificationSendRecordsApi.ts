import type { PagedResultDto } from '@abp/core';

import type {
  NotificationSendRecordDto,
  NotificationSendRecordGetPagedListInput,
} from '../types/send-records';

import { useRequest } from '@abp/request';

export function useNotificationSendRecordsApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy danh sách phân trang bản ghi gửi thông báo
   * @param input Tham số lọc truy vấn
   * @returns {Promise<PagedResultDto<NotificationSendRecordDto>>} Danh sách phân trang bản ghi gửi thông báo
   */
  function getPagedListApi(
    input?: NotificationSendRecordGetPagedListInput,
  ): Promise<PagedResultDto<NotificationSendRecordDto>> {
    return request<PagedResultDto<NotificationSendRecordDto>>(
      '/api/notifications/send-records',
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Xóa bản ghi gửi
   * @param id Id bản ghi gửi
   * @returns {Promise<void>}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/notifications/send-records/${id}`, {
      method: 'DELETE',
    });
  }
  /**
   * Gửi lại thông báo
   * @param id Id bản ghi gửi
   * @returns {Promise<void>}
   */
  function reSendApi(id: string): Promise<void> {
    return request(`/api/notifications/send-records/${id}/re-send`, {
      method: 'POST',
    });
  }

  return {
    cancel,
    deleteApi,
    getPagedListApi,
    reSendApi,
  };
}
