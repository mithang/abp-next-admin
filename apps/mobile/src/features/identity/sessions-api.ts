import { apiRequest, type PagedResult } from '../../lib/api-client';
import type { GetUserSessionsInput, IdentitySessionDto } from './sessions';

/** GET /api/identity/sessions — phân trang ABP, lọc theo device (ô tìm kiếm mobile). */
export function getSessionsPaged(input: GetUserSessionsInput = {}) {
  return apiRequest<PagedResult<IdentitySessionDto>>('/api/identity/sessions', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      userId: input.userId,
      device: input.device,
      clientId: input.clientId,
    },
  });
}

/** DELETE /api/identity/sessions/{sessionId}/revoke — sessionId đã encode, không dùng id entity. */
export function revokeSession(sessionId: string) {
  return apiRequest<void>(`/api/identity/sessions/${encodeURIComponent(sessionId)}/revoke`, { method: 'DELETE' });
}
