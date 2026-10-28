import type { PagedResultDto } from '@abp/core';

import type {
  GetMyNotifilerPagedListInput,
  MarkReadStateInput,
  UserNotificationDto,
} from '../types/my-notifilers';

import { useRequest } from '@abp/request';

export function useMyNotifilersApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy danh sách thông báo của tôi
   * @param {GetMyNotifilerPagedListInput} input Tham số
   * @returns {Promise<PagedResultDto<UserNotificationDto>>} Danh sách phân trang thông báo
   */
  function getMyNotifilersApi(
    input?: GetMyNotifilerPagedListInput,
  ): Promise<PagedResultDto<UserNotificationDto>> {
    return request<PagedResultDto<UserNotificationDto>>(
      '/api/notifications/my-notifilers',
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Xóa thông báo của tôi
   * @param {string} id Id thông báo
   * @returns {void}
   */
  function deleteMyNotifilerApi(id: string): Promise<void> {
    return request(`/api/notifications/my-notifilers/${id}`, {
      method: 'DELETE',
    });
  }
  /**
   * Đặt trạng thái đã đọc của thông báo
   * @param {MarkReadStateInput} input Tham số
   * @returns {void}
   */
  function markReadStateApi(input: MarkReadStateInput): Promise<void> {
    return request(`/api/notifications/my-notifilers/mark-read-state`, {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    deleteMyNotifilerApi,
    getMyNotifilersApi,
    markReadStateApi,
  };
}
