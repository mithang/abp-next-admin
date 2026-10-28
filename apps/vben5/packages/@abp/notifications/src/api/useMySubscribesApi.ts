import type { ListResultDto } from '@abp/core';

import type { UserSubscreNotification } from '../types/subscribes';

import { useRequest } from '@abp/request';

export function useMySubscribesApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy tất cả thông báo đã đăng ký của tôi
   * @returns Danh sách thông báo đã đăng ký
   */
  function getMySubscribesApi(): Promise<
    ListResultDto<UserSubscreNotification>
  > {
    return request<ListResultDto<UserSubscreNotification>>(
      '/api/notifications/my-subscribes/all',
      {
        method: 'GET',
      },
    );
  }

  /**
   * Đăng ký thông báo
   * @param name Tên thông báo
   */
  function subscribeApi(name: string): Promise<void> {
    return request('/api/notifications/my-subscribes', {
      data: {
        name,
      },
      method: 'POST',
    });
  }

  /**
   * Hủy đăng ký thông báo
   * @param name Tên thông báo
   */
  function unSubscribeApi(name: string): Promise<void> {
    return request(`/api/notifications/my-subscribes?name=${name}`, {
      method: 'DELETE',
    });
  }

  return {
    cancel,
    getMySubscribesApi,
    subscribeApi,
    unSubscribeApi,
  };
}
