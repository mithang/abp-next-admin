import type { ListResultDto } from '@abp/core';

import type {
  NotificationGroupDto,
  NotificationProviderDto,
  NotificationTemplateDto,
} from '../types/definitions';
import type {
  NotificationSendInput,
  NotificationTemplateSendInput,
} from '../types/notifications';

import { useRequest } from '@abp/request';

export function useNotificationsApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy danh sách nhà cung cấp thông báo khả dụng
   * @returns {Promise<ListResultDto<NotificationProviderDto>>} Danh sách nhà cung cấp thông báo khả dụng
   */
  function getAssignableProvidersApi(): Promise<
    ListResultDto<NotificationProviderDto>
  > {
    return request<ListResultDto<NotificationProviderDto>>(
      '/api/notifications/assignable-providers',
      {
        method: 'GET',
      },
    );
  }
  /**
   * Lấy danh sách thông báo khả dụng
   * @returns {Promise<ListResultDto<NotificationGroupDto>>} Danh sách thông báo khả dụng
   */
  function getAssignableNotifiersApi(): Promise<
    ListResultDto<NotificationGroupDto>
  > {
    return request<ListResultDto<NotificationGroupDto>>(
      '/api/notifications/assignables',
      {
        method: 'GET',
      },
    );
  }
  /**
   * Lấy danh sách mẫu thông báo khả dụng
   * @returns {Promise<ListResultDto<NotificationTemplateDto>>} Danh sách mẫu thông báo khả dụng
   */
  function getAssignableTemplatesApi(): Promise<
    ListResultDto<NotificationTemplateDto>
  > {
    return request<ListResultDto<NotificationTemplateDto>>(
      '/api/notifications/assignable-templates',
      {
        method: 'GET',
      },
    );
  }
  /**
   * Gửi thông báo
   * @param input Tham số
   * @returns {Promise<void>}
   */
  function sendNotiferApi(input: NotificationSendInput): Promise<void> {
    return request('/api/notifications/send', {
      data: input,
      method: 'POST',
    });
  }
  /**
   * Gửi thông báo mẫu
   * @param input Tham số
   * @returns {Promise<void>}
   */
  function sendTemplateNotiferApi(
    input: NotificationTemplateSendInput,
  ): Promise<void> {
    return request('/api/notifications/send/template', {
      data: input,
      method: 'POST',
    });
  }

  return {
    cancel,
    getAssignableNotifiersApi,
    getAssignableProvidersApi,
    getAssignableTemplatesApi,
    sendNotiferApi,
    sendTemplateNotiferApi,
  };
}
