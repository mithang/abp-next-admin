import type { PagedResultDto } from '@abp/core';

import type { GetUserSessionsInput, IdentitySessionDto } from '../types';

import { useRequest } from '@abp/request';

export function useUserSessionsApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn danh sách phiên
   * @param { GetUserSessionsInput } input Tham số truy vấn
   * @returns { Promise<PagedResultDto<IdentitySessionDto>> } Danh sách phiên người dùng
   */
  function getSessionsApi(
    input?: GetUserSessionsInput,
  ): Promise<PagedResultDto<IdentitySessionDto>> {
    return request<PagedResultDto<IdentitySessionDto>>(
      '/api/identity/sessions',
      {
        method: 'GET',
        params: input,
      },
    );
  }
  /**
   * Thu hồi phiên
   * @param { string } sessionId ID phiên
   * @returns { Promise<void> }
   */
  function revokeSessionApi(sessionId: string): Promise<void> {
    return request(`/api/identity/sessions/${sessionId}/revoke`, {
      method: 'DELETE',
    });
  }

  return {
    cancel,
    getSessionsApi,
    revokeSessionApi,
  };
}
