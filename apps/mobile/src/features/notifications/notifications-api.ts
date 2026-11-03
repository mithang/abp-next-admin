import { apiPath, apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type {
  GetMyNotifilerPagedListInput,
  MarkReadStateInput,
  NotificationDefinitionCreateDto,
  NotificationDefinitionDto,
  NotificationDefinitionGetListInput,
  NotificationDefinitionUpdateDto,
  NotificationGroupDefinitionCreateDto,
  NotificationGroupDefinitionDto,
  NotificationGroupDefinitionGetListInput,
  NotificationGroupDefinitionUpdateDto,
  NotificationSendInput,
  NotificationSendRecordDto,
  NotificationSendRecordGetPagedListInput,
  UserNotificationDto,
} from './types';

/** GET /api/notifications/my-notifilers — phân trang ABP, lọc filter/readState. */
export function getMyNotificationsPaged(input: GetMyNotifilerPagedListInput = {}) {
  return apiRequest<PagedResult<UserNotificationDto>>('/api/notifications/my-notifilers', {
    method: 'GET',
    params: {
      filter: input.filter,
      readState: input.readState,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** GET /api/notifications/my-notifilers/{id} — backend id là long, encode như mọi id khác. */
export function getMyNotification(id: string) {
  return apiRequest<UserNotificationDto>(apiPath('/api/notifications/my-notifilers', id), {
    method: 'GET',
  });
}

/** DELETE /api/notifications/my-notifilers/{id} */
export function deleteMyNotification(id: string) {
  return apiRequest<void>(apiPath('/api/notifications/my-notifilers', id), {
    method: 'DELETE',
  });
}

/** PUT /api/notifications/my-notifilers/mark-read-state — body { idList, state }. */
export function markMyNotificationsRead(input: MarkReadStateInput) {
  return apiRequest<void>('/api/notifications/my-notifilers/mark-read-state', {
    method: 'PUT',
    body: input,
  });
}

/** GET /api/notifications/definitions/groups — ListResult, không phân trang server. */
export function getNotificationGroups(input: NotificationGroupDefinitionGetListInput = {}) {
  return apiRequest<ListResult<NotificationGroupDefinitionDto>>(
    '/api/notifications/definitions/groups',
    {
      method: 'GET',
      params: { filter: input.filter },
    },
  );
}

/** GET /api/notifications/definitions/groups/{name} */
export function getNotificationGroup(name: string) {
  return apiRequest<NotificationGroupDefinitionDto>(
    apiPath('/api/notifications/definitions/groups', name),
    { method: 'GET' },
  );
}

/** POST /api/notifications/definitions/groups */
export function createNotificationGroup(input: NotificationGroupDefinitionCreateDto) {
  return apiRequest<NotificationGroupDefinitionDto>('/api/notifications/definitions/groups', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/notifications/definitions/groups/{name} — không gửi name (key). */
export function updateNotificationGroup(name: string, input: NotificationGroupDefinitionUpdateDto) {
  return apiRequest<NotificationGroupDefinitionDto>(
    apiPath('/api/notifications/definitions/groups', name),
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/notifications/definitions/groups/{name} — web chỉ hiện khi !isStatic. */
export function deleteNotificationGroup(name: string) {
  return apiRequest<void>(apiPath('/api/notifications/definitions/groups', name), {
    method: 'DELETE',
  });
}

/** GET /api/notifications/definitions/notifications — ListResult, không phân trang server. */
export function getNotificationDefinitions(input: NotificationDefinitionGetListInput = {}) {
  return apiRequest<ListResult<NotificationDefinitionDto>>(
    '/api/notifications/definitions/notifications',
    {
      method: 'GET',
      params: {
        filter: input.filter,
        groupName: input.groupName,
        allowSubscriptionToClients: input.allowSubscriptionToClients,
        contentType: input.contentType,
        notificationLifetime: input.notificationLifetime,
        notificationType: input.notificationType,
        template: input.template,
      },
    },
  );
}

/** GET /api/notifications/definitions/notifications/{name} */
export function getNotificationDefinition(name: string) {
  return apiRequest<NotificationDefinitionDto>(
    apiPath('/api/notifications/definitions/notifications', name),
    { method: 'GET' },
  );
}

/** POST /api/notifications/definitions/notifications */
export function createNotificationDefinition(input: NotificationDefinitionCreateDto) {
  return apiRequest<NotificationDefinitionDto>('/api/notifications/definitions/notifications', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/notifications/definitions/notifications/{name} — không gửi name/groupName (key). */
export function updateNotificationDefinition(name: string, input: NotificationDefinitionUpdateDto) {
  return apiRequest<NotificationDefinitionDto>(
    apiPath('/api/notifications/definitions/notifications', name),
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/notifications/definitions/notifications/{name} — web chỉ hiện khi !isStatic. */
export function deleteNotificationDefinition(name: string) {
  return apiRequest<void>(apiPath('/api/notifications/definitions/notifications', name), {
    method: 'DELETE',
  });
}

/** POST /api/notifications/send — gửi thông báo theo định nghĩa (web NotificationSendModal). */
export function sendNotification(input: NotificationSendInput) {
  return apiRequest<void>('/api/notifications/send', { method: 'POST', body: input });
}

/** GET /api/notifications/send-records — phân trang ABP. Backend KHÔNG có GET {id} (chỉ list/xóa/gửi lại) nên mobile không có màn detail. */
export function getNotificationSendRecordsPaged(
  input: NotificationSendRecordGetPagedListInput = {},
) {
  return apiRequest<PagedResult<NotificationSendRecordDto>>('/api/notifications/send-records', {
    method: 'GET',
    params: {
      notificationName: input.notificationName,
      provider: input.provider,
      state: input.state,
      userId: input.userId,
      beginSendTime: input.beginSendTime,
      endSendTime: input.endSendTime,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** DELETE /api/notifications/send-records/{id} */
export function deleteNotificationSendRecord(id: string) {
  return apiRequest<void>(apiPath('/api/notifications/send-records', id), {
    method: 'DELETE',
  });
}

/** POST /api/notifications/send-records/{id}/re-send */
export function reSendNotificationRecord(id: string) {
  return apiRequest<void>(apiPath('/api/notifications/send-records', id, 're-send'), {
    method: 'POST',
  });
}
