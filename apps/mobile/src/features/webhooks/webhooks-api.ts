import { apiPath, apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type {
  WebhookAvailableGroupDto,
  WebhookDefinitionCreateDto,
  WebhookDefinitionDto,
  WebhookDefinitionGetListInput,
  WebhookDefinitionUpdateDto,
  WebhookGroupDefinitionCreateDto,
  WebhookGroupDefinitionDto,
  WebhookGroupDefinitionGetListInput,
  WebhookGroupDefinitionUpdateDto,
  WebhookSendRecordDeleteManyInput,
  WebhookSendRecordDto,
  WebhookSendRecordGetListInput,
  WebhookSendRecordResendManyInput,
  WebhookSubscriptionCreateDto,
  WebhookSubscriptionDeleteManyInput,
  WebhookSubscriptionDto,
  WebhookSubscriptionGetListInput,
  WebhookSubscriptionUpdateDto,
} from './types';

const GROUPS_BASE = '/api/webhooks/definitions/groups';
const DEFINITIONS_BASE = '/api/webhooks/definitions';
const SUBSCRIPTIONS_BASE = '/api/webhooks/subscriptions';
const SEND_ATTEMPTS_BASE = '/api/webhooks/send-attempts';

/* ---------------- Nhóm Webhook: ListResult, key = name ---------------- */

/** GET /api/webhooks/definitions/groups — ListResult, lọc filter. */
export function getWebhookGroupDefinitions(input: WebhookGroupDefinitionGetListInput = {}) {
  return apiRequest<ListResult<WebhookGroupDefinitionDto>>(GROUPS_BASE, {
    method: 'GET',
    params: { filter: input.filter },
  });
}

/** GET /api/webhooks/definitions/groups/{name} */
export function getWebhookGroupDefinition(name: string) {
  return apiRequest<WebhookGroupDefinitionDto>(apiPath(GROUPS_BASE, name), {
    method: 'GET',
  });
}

/** POST /api/webhooks/definitions/groups — tạo nhập name + displayName. */
export function createWebhookGroupDefinition(input: WebhookGroupDefinitionCreateDto) {
  return apiRequest<WebhookGroupDefinitionDto>(GROUPS_BASE, { method: 'POST', body: input });
}

/** PUT /api/webhooks/definitions/groups/{name} — sửa không gửi name. */
export function updateWebhookGroupDefinition(name: string, input: WebhookGroupDefinitionUpdateDto) {
  return apiRequest<WebhookGroupDefinitionDto>(apiPath(GROUPS_BASE, name), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/webhooks/definitions/groups/{name} — bảng web ẩn với nhóm tĩnh. */
export function deleteWebhookGroupDefinition(name: string) {
  return apiRequest<void>(apiPath(GROUPS_BASE, name), { method: 'DELETE' });
}

/* ---------------- Định nghĩa Webhook: ListResult, key = name ---------------- */

/** GET /api/webhooks/definitions — ListResult, lọc filter/groupName. */
export function getWebhookDefinitions(input: WebhookDefinitionGetListInput = {}) {
  return apiRequest<ListResult<WebhookDefinitionDto>>(DEFINITIONS_BASE, {
    method: 'GET',
    params: { filter: input.filter, groupName: input.groupName },
  });
}

/** GET /api/webhooks/definitions/{name} */
export function getWebhookDefinition(name: string) {
  return apiRequest<WebhookDefinitionDto>(apiPath(DEFINITIONS_BASE, name), {
    method: 'GET',
  });
}

/** POST /api/webhooks/definitions — tạo nhập groupName + name. */
export function createWebhookDefinition(input: WebhookDefinitionCreateDto) {
  return apiRequest<WebhookDefinitionDto>(DEFINITIONS_BASE, { method: 'POST', body: input });
}

/** PUT /api/webhooks/definitions/{name} — sửa không gửi groupName/name. */
export function updateWebhookDefinition(name: string, input: WebhookDefinitionUpdateDto) {
  return apiRequest<WebhookDefinitionDto>(apiPath(DEFINITIONS_BASE, name), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/webhooks/definitions/{name} — bảng web ẩn với định nghĩa tĩnh. */
export function deleteWebhookDefinition(name: string) {
  return apiRequest<void>(apiPath(DEFINITIONS_BASE, name), { method: 'DELETE' });
}

/* ---------------- Đăng ký Webhook: phân trang ABP, key = Guid ---------------- */

/** GET /api/webhooks/subscriptions — phân trang ABP, lọc filter/webhookUri/isActive. */
export function getWebhookSubscriptionsPaged(input: WebhookSubscriptionGetListInput = {}) {
  return apiRequest<PagedResult<WebhookSubscriptionDto>>(SUBSCRIPTIONS_BASE, {
    method: 'GET',
    params: {
      filter: input.filter,
      webhookUri: input.webhookUri,
      isActive: input.isActive,
      webhooks: input.webhooks,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** GET /api/webhooks/subscriptions/{id} */
export function getWebhookSubscription(id: string) {
  return apiRequest<WebhookSubscriptionDto>(apiPath(SUBSCRIPTIONS_BASE, id), {
    method: 'GET',
  });
}

/** POST /api/webhooks/subscriptions */
export function createWebhookSubscription(input: WebhookSubscriptionCreateDto) {
  return apiRequest<WebhookSubscriptionDto>(SUBSCRIPTIONS_BASE, { method: 'POST', body: input });
}

/** PUT /api/webhooks/subscriptions/{id} — gửi concurrencyStamp (UpdateDto). */
export function updateWebhookSubscription(id: string, input: WebhookSubscriptionUpdateDto) {
  return apiRequest<WebhookSubscriptionDto>(apiPath(SUBSCRIPTIONS_BASE, id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/webhooks/subscriptions/{id} */
export function deleteWebhookSubscription(id: string) {
  return apiRequest<void>(apiPath(SUBSCRIPTIONS_BASE, id), { method: 'DELETE' });
}

/**
 * DELETE /api/webhooks/subscriptions/delete-many — API bulk của web;
 * màn list gọi qua chế độ chọn nhiều (vòng 20, mẫu Tác vụ nền).
 */
export function bulkDeleteWebhookSubscriptions(input: WebhookSubscriptionDeleteManyInput) {
  return apiRequest<void>(`${SUBSCRIPTIONS_BASE}/delete-many`, { method: 'DELETE', body: input });
}

/** GET /api/webhooks/subscriptions/availables — gợi ý webhook cho form đăng ký. */
export function getAvailableWebhooks() {
  return apiRequest<ListResult<WebhookAvailableGroupDto>>(`${SUBSCRIPTIONS_BASE}/availables`, {
    method: 'GET',
  });
}

/* ---------------- Bản ghi gửi Webhook: phân trang ABP, key = Guid ---------------- */

/** GET /api/webhooks/send-attempts — phân trang ABP, lọc filter/state/status. */
export function getWebhookSendAttemptsPaged(input: WebhookSendRecordGetListInput = {}) {
  return apiRequest<PagedResult<WebhookSendRecordDto>>(SEND_ATTEMPTS_BASE, {
    method: 'GET',
    params: {
      filter: input.filter,
      state: input.state,
      subscriptionId: input.subscriptionId,
      webhookEventId: input.webhookEventId,
      responseStatusCode: input.responseStatusCode,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** GET /api/webhooks/send-attempts/{id} */
export function getWebhookSendAttempt(id: string) {
  return apiRequest<WebhookSendRecordDto>(apiPath(SEND_ATTEMPTS_BASE, id), {
    method: 'GET',
  });
}

/** DELETE /api/webhooks/send-attempts/{id} */
export function deleteWebhookSendAttempt(id: string) {
  return apiRequest<void>(apiPath(SEND_ATTEMPTS_BASE, id), { method: 'DELETE' });
}

/**
 * DELETE /api/webhooks/send-attempts/delete-many — API bulk của web;
 * màn list gọi qua chế độ chọn nhiều (vòng 20, mẫu Tác vụ nền).
 */
export function bulkDeleteWebhookSendAttempts(input: WebhookSendRecordDeleteManyInput) {
  return apiRequest<void>(`${SEND_ATTEMPTS_BASE}/delete-many`, { method: 'DELETE', body: input });
}

/** POST /api/webhooks/send-attempts/{id}/resend */
export function resendWebhookSendAttempt(id: string) {
  return apiRequest<void>(apiPath(SEND_ATTEMPTS_BASE, id, 'resend'), {
    method: 'POST',
  });
}

/**
 * POST /api/webhooks/send-attempts/resend-many — API bulk của web;
 * màn list gọi qua chế độ chọn nhiều (vòng 20, mẫu Tác vụ nền).
 */
export function bulkResendWebhookSendAttempts(input: WebhookSendRecordResendManyInput) {
  return apiRequest<void>(`${SEND_ATTEMPTS_BASE}/resend-many`, { method: 'POST', body: input });
}
