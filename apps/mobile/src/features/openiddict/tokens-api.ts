import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import type { OpenIddictTokenDto, OpenIddictTokenGetListInput } from './types';

/**
 * GET /api/openiddict/tokens — đã kiểm chứng từ useTokensApi.ts của web.
 * Web chỉ có list/detail/delete (TokenModal chỉ đọc) nên mobile không có
 * create/update cho nhóm này. Detail screen chỉ hiển thị metadata, không
 * hiển thị payload token (nhạy cảm).
 */
export function getTokensPaged(input: OpenIddictTokenGetListInput = {}) {
  return apiRequest<PagedResult<OpenIddictTokenDto>>('/api/openiddict/tokens', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
      subject: input.subject,
      status: input.status,
      type: input.type,
      clientId: input.clientId,
    },
  });
}

/** GET /api/openiddict/tokens/{id} */
export function getToken(id: string) {
  return apiRequest<OpenIddictTokenDto>(apiPath('/api/openiddict/tokens', id), {
    method: 'GET',
  });
}

/** DELETE /api/openiddict/tokens/{id} */
export function deleteToken(id: string) {
  return apiRequest<void>(apiPath('/api/openiddict/tokens', id), { method: 'DELETE' });
}
