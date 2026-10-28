import type { ListResultDto } from '@abp/core';

import type {
  NotificationGroupDefinitionCreateDto,
  NotificationGroupDefinitionDto,
  NotificationGroupDefinitionGetListInput,
  NotificationGroupDefinitionUpdateDto,
} from '../types';

import { useRequest } from '@abp/request';

export function useNotificationGroupDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa nhóm thông báo
   * @param name Tên nhóm thông báo
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/notifications/definitions/groups/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa nhóm thông báo
   * @param name Tên nhóm thông báo
   * @returns Đối tượng truyền dữ liệu định nghĩa nhóm thông báo
   */
  function getApi(name: string): Promise<NotificationGroupDefinitionDto> {
    return request<NotificationGroupDefinitionDto>(
      `/api/notifications/definitions/groups/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách định nghĩa nhóm thông báo
   * @param input Điều kiện lọc nhóm thông báo
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa nhóm thông báo
   */
  function getListApi(
    input?: NotificationGroupDefinitionGetListInput,
  ): Promise<ListResultDto<NotificationGroupDefinitionDto>> {
    return request<ListResultDto<NotificationGroupDefinitionDto>>(
      `/api/notifications/definitions/groups`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa nhóm thông báo
   * @param input Tham số định nghĩa nhóm thông báo
   * @returns Đối tượng truyền dữ liệu định nghĩa nhóm thông báo
   */
  function createApi(
    input: NotificationGroupDefinitionCreateDto,
  ): Promise<NotificationGroupDefinitionDto> {
    return request<NotificationGroupDefinitionDto>(
      '/api/notifications/definitions/groups',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Cập nhật định nghĩa nhóm thông báo
   * @param name Tên nhóm thông báo
   * @param input Tham số định nghĩa nhóm thông báo
   * @returns Đối tượng truyền dữ liệu định nghĩa nhóm thông báo
   */
  function updateApi(
    name: string,
    input: NotificationGroupDefinitionUpdateDto,
  ): Promise<NotificationGroupDefinitionDto> {
    return request<NotificationGroupDefinitionDto>(
      `/api/notifications/definitions/groups/${name}`,
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
