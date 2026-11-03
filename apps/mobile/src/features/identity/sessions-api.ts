import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type { GetUserSessionsInput, IdentitySessionDto } from './sessions';

/** GET /api/identity/sessions — phân trang ABP, lọc theo device (ô tìm kiếm mobile). */
export function getSessionsPaged(input: GetUserSessionsInput = {}) {
  return apiRequest<PagedResult<IdentitySessionDto>>('/api/identity/sessions', {
    method: 'GET',
    params: {
      ...pagedDefaults(input),
      sorting: input.sorting,
      userId: input.userId,
      device: input.device,
      clientId: input.clientId,
    },
  });
}

/** DELETE /api/identity/sessions/{sessionId}/revoke — sessionId đã encode, không dùng id entity. */
export function revokeSession(sessionId: string) {
  return apiRequest<void>(apiPath('/api/identity/sessions', sessionId, 'revoke'), {
    method: 'DELETE',
  });
}
