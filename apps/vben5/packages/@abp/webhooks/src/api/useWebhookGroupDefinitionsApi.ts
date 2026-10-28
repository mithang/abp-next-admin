import type { ListResultDto } from '@abp/core';

import type {
  WebhookGroupDefinitionCreateDto,
  WebhookGroupDefinitionDto,
  WebhookGroupDefinitionGetListInput,
  WebhookGroupDefinitionUpdateDto,
} from '../types/groups';

import { useRequest } from '@abp/request';

export function useWebhookGroupDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa nhóm Webhook
   * @param name Tên nhóm Webhook
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/webhooks/definitions/groups/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa nhóm Webhook
   * @param name Tên nhóm Webhook
   * @returns Đối tượng truyền dữ liệu định nghĩa nhóm Webhook
   */
  function getApi(name: string): Promise<WebhookGroupDefinitionDto> {
    return request<WebhookGroupDefinitionDto>(
      `/api/webhooks/definitions/groups/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Truy vấn danh sách định nghĩa nhóm Webhook
   * @param input Điều kiện lọc nhóm Webhook
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa nhóm Webhook
   */
  function getListApi(
    input?: WebhookGroupDefinitionGetListInput,
  ): Promise<ListResultDto<WebhookGroupDefinitionDto>> {
    return request<ListResultDto<WebhookGroupDefinitionDto>>(
      `/api/webhooks/definitions/groups`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa nhóm Webhook
   * @param input Tham số định nghĩa nhóm Webhook
   * @returns Đối tượng truyền dữ liệu định nghĩa nhóm Webhook
   */
  function createApi(
    input: WebhookGroupDefinitionCreateDto,
  ): Promise<WebhookGroupDefinitionDto> {
    return request<WebhookGroupDefinitionDto>(
      '/api/webhooks/definitions/groups',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Cập nhật định nghĩa nhóm Webhook
   * @param name Tên nhóm Webhook
   * @param input Tham số định nghĩa nhóm Webhook
   * @returns Đối tượng truyền dữ liệu định nghĩa nhóm Webhook
   */
  function updateApi(
    name: string,
    input: WebhookGroupDefinitionUpdateDto,
  ): Promise<WebhookGroupDefinitionDto> {
    return request<WebhookGroupDefinitionDto>(
      `/api/webhooks/definitions/groups/${name}`,
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
