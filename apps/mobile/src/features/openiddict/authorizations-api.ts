import { apiRequest, type PagedResult } from '../../lib/api-client';
import type {
  OpenIddictAuthorizationDto,
  OpenIddictAuthorizationGetListInput,
} from './types';

/**
 * GET /api/openiddict/authorizations — đã kiểm chứng từ useAuthorizationsApi.ts của web.
 * Web chỉ có list/detail/delete (AuthorizationModal chỉ đọc) nên mobile không có
 * create/update cho nhóm này.
 */
export function getAuthorizationsPaged(input: OpenIddictAuthorizationGetListInput = {}) {
  return apiRequest<PagedResult<OpenIddictAuthorizationDto>>('/api/openiddict/authorizations', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
      subject: input.subject,
      status: input.status,
      type: input.type,
    },
  });
}

/** GET /api/openiddict/authorizations/{id} */
export function getAuthorization(id: string) {
  return apiRequest<OpenIddictAuthorizationDto>(`/api/openiddict/authorizations/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** DELETE /api/openiddict/authorizations/{id} */
export function deleteAuthorization(id: string) {
  return apiRequest<void>(`/api/openiddict/authorizations/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
