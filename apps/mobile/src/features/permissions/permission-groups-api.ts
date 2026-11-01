import { apiRequest, type ListResult } from '../../lib/api-client';
import type {
  PermissionGroupDefinitionCreateDto,
  PermissionGroupDefinitionDto,
  PermissionGroupDefinitionGetListInput,
  PermissionGroupDefinitionUpdateDto,
} from './types';

/**
 * GET /api/permission-management/definitions/groups — web chỉ lọc theo
 * filter và phân trang phía client (PermissionGroupDefinitionTable), nên
 * mobile lấy toàn bộ danh sách rồi hiển thị qua FlatList.
 */
export function getPermissionGroups(input: PermissionGroupDefinitionGetListInput = {}) {
  return apiRequest<ListResult<PermissionGroupDefinitionDto>>('/api/permission-management/definitions/groups', {
    method: 'GET',
    params: { filter: input.filter },
  });
}

/** GET /api/permission-management/definitions/groups/{name} */
export function getPermissionGroup(name: string) {
  return apiRequest<PermissionGroupDefinitionDto>(
    `/api/permission-management/definitions/groups/${encodeURIComponent(name)}`,
    { method: 'GET' },
  );
}

/** POST /api/permission-management/definitions/groups */
export function createPermissionGroup(input: PermissionGroupDefinitionCreateDto) {
  return apiRequest<PermissionGroupDefinitionDto>('/api/permission-management/definitions/groups', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/permission-management/definitions/groups/{name} — chỉ displayName (+ extraProperties). */
export function updatePermissionGroup(name: string, input: PermissionGroupDefinitionUpdateDto) {
  return apiRequest<PermissionGroupDefinitionDto>(
    `/api/permission-management/definitions/groups/${encodeURIComponent(name)}`,
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/permission-management/definitions/groups/{name} */
export function deletePermissionGroup(name: string) {
  return apiRequest<void>(`/api/permission-management/definitions/groups/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}
