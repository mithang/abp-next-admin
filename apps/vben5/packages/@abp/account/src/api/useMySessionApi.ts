import type { PagedResultDto } from '@abp/core';
import type { GetMySessionsInput, IdentitySessionDto } from '@abp/identity';

import { useRequest } from '@abp/request';

export function useMySessionApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn danh sách phiên
   * @param { GetMySessionsInput } input Tham số truy vấn
   * @returns { Promise<PagedResultDto<IdentitySessionDto>> } Danh sách phiên người dùng
   */
  function getSessionsApi(
    input?: GetMySessionsInput,
  ): Promise<PagedResultDto<IdentitySessionDto>> {
    return request<PagedResultDto<IdentitySessionDto>>(
      '/api/account/my-profile/sessions',
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
    return request(`/api/account/my-profile/sessions/${sessionId}/revoke`, {
      method: 'DELETE',
    });
  }

  return {
    cancel,
    getSessionsApi,
    revokeSessionApi,
  };
}
