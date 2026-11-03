import { apiPath, apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type {
  GetOrganizationUnitPagedListInput,
  OrganizationUnitCreateInput,
  OrganizationUnitDto,
  OrganizationUnitUpdateInput,
} from './organization-units';

/** GET /api/identity/organization-units/all — toàn bộ cây, dùng dựng tree ở client. */
export function getOrganizationUnitsAll() {
  return apiRequest<ListResult<OrganizationUnitDto>>('/api/identity/organization-units/all', {
    method: 'GET',
  });
}

/** GET /api/identity/organization-units — danh sách phân trang (giữ theo API web). */
export function getOrganizationUnitsPaged(input: GetOrganizationUnitPagedListInput = {}) {
  return apiRequest<PagedResult<OrganizationUnitDto>>('/api/identity/organization-units', {
    method: 'GET',
    params: {
      ...pagedDefaults(input),
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/identity/organization-units/{id} */
export function getOrganizationUnit(id: string) {
  return apiRequest<OrganizationUnitDto>(apiPath('/api/identity/organization-units', id), {
    method: 'GET',
  });
}

/** POST /api/identity/organization-units — create nhận displayName + parentId (theo OrganizationUnitCreateDto). */
export function createOrganizationUnit(input: OrganizationUnitCreateInput) {
  return apiRequest<OrganizationUnitDto>('/api/identity/organization-units', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/identity/organization-units/{id} — update chỉ nhận displayName (theo OrganizationUnitUpdateDto). */
export function updateOrganizationUnit(id: string, input: OrganizationUnitUpdateInput) {
  return apiRequest<OrganizationUnitDto>(apiPath('/api/identity/organization-units', id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/identity/organization-units/{id} */
export function deleteOrganizationUnit(id: string) {
  return apiRequest<void>(apiPath('/api/identity/organization-units', id), {
    method: 'DELETE',
  });
}
