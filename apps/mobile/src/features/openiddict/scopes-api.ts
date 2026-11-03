import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import type {
  OpenIddictScopeCreateOrUpdateDto,
  OpenIddictScopeDto,
  OpenIddictScopeGetListInput,
} from './types';

/** GET /api/openiddict/scopes — đã kiểm chứng từ useScopesApi.ts của web. */
export function getScopesPaged(input: OpenIddictScopeGetListInput = {}) {
  return apiRequest<PagedResult<OpenIddictScopeDto>>('/api/openiddict/scopes', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/openiddict/scopes/{id} */
export function getScope(id: string) {
  return apiRequest<OpenIddictScopeDto>(apiPath('/api/openiddict/scopes', id), {
    method: 'GET',
  });
}

/** POST /api/openiddict/scopes */
export function createScope(input: OpenIddictScopeCreateOrUpdateDto) {
  return apiRequest<OpenIddictScopeDto>('/api/openiddict/scopes', { method: 'POST', body: input });
}

/** PUT /api/openiddict/scopes/{id} */
export function updateScope(id: string, input: OpenIddictScopeCreateOrUpdateDto) {
  return apiRequest<OpenIddictScopeDto>(apiPath('/api/openiddict/scopes', id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/openiddict/scopes/{id} */
export function deleteScope(id: string) {
  return apiRequest<void>(apiPath('/api/openiddict/scopes', id), { method: 'DELETE' });
}
