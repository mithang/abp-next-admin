import type { ListResultDto, PagedResultDto } from '@abp/core';

import type {
  WebhookAvailableGroupDto,
  WebhookSubscriptionCreateDto,
  WebhookSubscriptionDeleteManyInput,
  WebhookSubscriptionDto,
  WebhookSubscriptionGetListInput,
  WebhookSubscriptionUpdateDto,
} from '../types/subscriptions';

import { useRequest } from '@abp/request';

export function useSubscriptionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Tạo đăng ký
   * @param input Tham số
   * @returns Dto đăng ký
   */
  function createApi(
    input: WebhookSubscriptionCreateDto,
  ): Promise<WebhookSubscriptionDto> {
    return request<WebhookSubscriptionDto>(`/api/webhooks/subscriptions`, {
      data: input,
      method: 'POST',
    });
  }
  /**
   * Xóa đăng ký
   * @param id Id đăng ký
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/webhooks/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }
  /**
   * Xóa hàng loạt đăng ký
   * @param input Tham số
   */
  function bulkDeleteApi(
    input: WebhookSubscriptionDeleteManyInput,
  ): Promise<void> {
    return request(`/api/webhooks/subscriptions/delete-many`, {
      data: input,
      method: 'DELETE',
    });
  }
  /**
   * Truy vấn danh sách tất cả nhóm Webhook khả dụng
   * @returns Danh sách nhóm Webhook
   */
  function getAllAvailableWebhooksApi(): Promise<
    ListResultDto<WebhookAvailableGroupDto>
  > {
    return request<ListResultDto<WebhookAvailableGroupDto>>(
      `/api/webhooks/subscriptions/availables`,
      {
        method: 'GET',
      },
    );
  }
  /**
   * Truy vấn đăng ký
   * @param id Id đăng ký
   * @returns Dto đăng ký
   */
  function getApi(id: string): Promise<WebhookSubscriptionDto> {
    return request<WebhookSubscriptionDto>(
      `/api/webhooks/subscriptions/${id}`,
      {
        method: 'GET',
      },
    );
  }
  /**
   * Truy vấn danh sách phân trang đăng ký
   * @param input Tham số lọc
   * @returns Danh sách Dto đăng ký
   */
  function getPagedListApi(
    input: WebhookSubscriptionGetListInput,
  ): Promise<PagedResultDto<WebhookSubscriptionDto>> {
    return request<PagedResultDto<WebhookSubscriptionDto>>(
      `/api/webhooks/subscriptions`,
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Cập nhật đăng ký
   * @param id Id đăng ký
   * @param input Tham số cập nhật
   * @returns Dto đăng ký
   */
  function updateApi(
    id: string,
    input: WebhookSubscriptionUpdateDto,
  ): Promise<WebhookSubscriptionDto> {
    return request<WebhookSubscriptionDto>(
      `/api/webhooks/subscriptions/${id}`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  return {
    bulkDeleteApi,
    cancel,
    createApi,
    deleteApi,
    getAllAvailableWebhooksApi,
    getApi,
    getPagedListApi,
    updateApi,
  };
}
