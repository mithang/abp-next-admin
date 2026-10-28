import type { ListResultDto } from '@abp/core';

import type {
  WebhookDefinitionCreateDto,
  WebhookDefinitionDto,
  WebhookDefinitionGetListInput,
  WebhookDefinitionUpdateDto,
} from '../types/definitions';

import { useRequest } from '@abp/request';

export function useWebhookDefinitionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Xóa định nghĩa Webhook
   * @param name Tên Webhook
   */
  function deleteApi(name: string): Promise<void> {
    return request(`/api/webhooks/definitions/${name}`, {
      method: 'DELETE',
    });
  }

  /**
   * Truy vấn định nghĩa Webhook
   * @param name Tên Webhook
   * @returns Đối tượng truyền dữ liệu định nghĩa Webhook
   */
  function getApi(name: string): Promise<WebhookDefinitionDto> {
    return request<WebhookDefinitionDto>(`/api/webhooks/definitions/${name}`, {
      method: 'GET',
    });
  }

  /**
   * Truy vấn danh sách định nghĩa Webhook
   * @param input Điều kiện lọc Webhook
   * @returns Danh sách đối tượng truyền dữ liệu định nghĩa Webhook
   */
  function getListApi(
    input?: WebhookDefinitionGetListInput,
  ): Promise<ListResultDto<WebhookDefinitionDto>> {
    return request<ListResultDto<WebhookDefinitionDto>>(
      `/api/webhooks/definitions`,
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Tạo định nghĩa Webhook
   * @param input Tham số định nghĩa Webhook
   * @returns Đối tượng truyền dữ liệu định nghĩa Webhook
   */
  function createApi(
    input: WebhookDefinitionCreateDto,
  ): Promise<WebhookDefinitionDto> {
    return request<WebhookDefinitionDto>('/api/webhooks/definitions', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Cập nhật định nghĩa Webhook
   * @param name Tên Webhook
   * @param input Tham số định nghĩa Webhook
   * @returns Đối tượng truyền dữ liệu định nghĩa Webhook
   */
  function updateApi(
    name: string,
    input: WebhookDefinitionUpdateDto,
  ): Promise<WebhookDefinitionDto> {
    return request<WebhookDefinitionDto>(`/api/webhooks/definitions/${name}`, {
      data: input,
      method: 'PUT',
    });
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
