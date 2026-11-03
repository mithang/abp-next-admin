import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import type { GetClaimTypePagedListInput, IdentityClaimTypeDto } from './claim-types';

/** GET /api/identity/claim-types — đã kiểm chứng từ useClaimTypesApi.ts của web app-antd. */
export function getClaimTypesPaged(input: GetClaimTypePagedListInput = {}) {
  return apiRequest<PagedResult<IdentityClaimTypeDto>>('/api/identity/claim-types', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/identity/claim-types/{id} */
export function getClaimType(id: string) {
  return apiRequest<IdentityClaimTypeDto>(apiPath('/api/identity/claim-types', id), {
    method: 'GET',
  });
}

/** POST /api/identity/claim-types — UI tạo/sửa để vòng sau (theo pattern roles). */
export function createClaimType(input: {
  name: string;
  valueType: number;
  required: boolean;
  isStatic: boolean;
  description?: string;
  regex?: string;
  regexDescription?: string;
}) {
  return apiRequest<IdentityClaimTypeDto>('/api/identity/claim-types', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/identity/claim-types/{id} — update chỉ nhận description/regex/required (theo IdentityClaimTypeUpdateDto). */
export function updateClaimType(
  id: string,
  input: { description?: string; regex?: string; regexDescription?: string; required: boolean },
) {
  return apiRequest<IdentityClaimTypeDto>(apiPath('/api/identity/claim-types', id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/identity/claim-types/{id} */
export function deleteClaimType(id: string) {
  return apiRequest<void>(apiPath('/api/identity/claim-types', id), {
    method: 'DELETE',
  });
}
