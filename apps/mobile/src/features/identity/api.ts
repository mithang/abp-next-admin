import { apiRequest, type PagedResult } from '../../lib/api-client';
import type { GetUserPagedListInput, IdentityUserDto } from './types';

/** GET /api/identity/users — đã kiểm chứng từ useUsersApi.ts của web app-antd. */
export function getUsersPaged(input: GetUserPagedListInput = {}) {
  return apiRequest<PagedResult<IdentityUserDto>>('/api/identity/users', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/identity/users/{id} */
export function getUser(id: string) {
  return apiRequest<IdentityUserDto>(`/api/identity/users/${encodeURIComponent(id)}`, { method: 'GET' });
}
