import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type { GetUserPagedListInput, IdentityUserDto } from './types';

/** GET /api/identity/users — đã kiểm chứng từ useUsersApi.ts của web app-antd. */
export function getUsersPaged(input: GetUserPagedListInput = {}) {
  return apiRequest<PagedResult<IdentityUserDto>>('/api/identity/users', {
    method: 'GET',
    params: {
      ...pagedDefaults(input),
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/identity/users/{id} */
export function getUser(id: string) {
  return apiRequest<IdentityUserDto>(apiPath('/api/identity/users', id), {
    method: 'GET',
  });
}
