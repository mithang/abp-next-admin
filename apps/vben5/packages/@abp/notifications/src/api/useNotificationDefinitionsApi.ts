import type { ListResultDto } from '@abp/core';

import type {
  NotificationDefinitionCreateDto,
  NotificationDefinitionDto,
  NotificationDefinitionGetListInput,
  NotificationDefinitionUpdateDto,
} from '../types/definitions';

import { useRequest } from '@abp/request';

export function useNotificationDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa thông báo
   * @param name Tên thông báo
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/notifications/definitions/notifications/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa thông báo
   * @param name Tên thông báo
   * @returns Đối tượng truyền dữ liệu định nghĩa thông báo
   */
  function getApi(name: string): Promise<NotificationDefinitionDto> {
    return request<NotificationDefinitionDto>(
      `/api/notifications/definitions/notifications/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách định nghĩa thông báo
   * @param input Điều kiện lọc thông báo
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa thông báo
   */
  function getListApi(
    input?: NotificationDefinitionGetListInput,
  ): Promise<ListResultDto<NotificationDefinitionDto>> {
    return request<ListResultDto<NotificationDefinitionDto>>(
      `/api/notifications/definitions/notifications`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa thông báo
   * @param input Tham số định nghĩa thông báo
   * @returns Đối tượng truyền dữ liệu định nghĩa thông báo
   */
  function createApi(
    input: NotificationDefinitionCreateDto,
  ): Promise<NotificationDefinitionDto> {
    return request<NotificationDefinitionDto>(
      '/api/notifications/definitions/notifications',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Cập nhật định nghĩa thông báo
   * @param name Tên thông báo
   * @param input Tham số định nghĩa thông báo
   * @returns Đối tượng truyền dữ liệu định nghĩa thông báo
   */
  function updateApi(
    name: string,
    input: NotificationDefinitionUpdateDto,
  ): Promise<NotificationDefinitionDto> {
    return request<NotificationDefinitionDto>(
      `/api/notifications/definitions/notifications/${name}`,
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
