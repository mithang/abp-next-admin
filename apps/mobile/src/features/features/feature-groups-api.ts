import { apiRequest, type ListResult } from '../../lib/api-client';
import type {
  FeatureGroupDefinitionCreateDto,
  FeatureGroupDefinitionDto,
  FeatureGroupDefinitionGetListInput,
  FeatureGroupDefinitionUpdateDto,
} from './types';

/** GET /api/feature-management/definitions/groups — web phân trang phía client. */
export function getFeatureGroups(input: FeatureGroupDefinitionGetListInput = {}) {
  return apiRequest<ListResult<FeatureGroupDefinitionDto>>('/api/feature-management/definitions/groups', {
    method: 'GET',
    params: { filter: input.filter },
  });
}

/** GET /api/feature-management/definitions/groups/{name} */
export function getFeatureGroup(name: string) {
  return apiRequest<FeatureGroupDefinitionDto>(
    `/api/feature-management/definitions/groups/${encodeURIComponent(name)}`,
    { method: 'GET' },
  );
}

/** POST /api/feature-management/definitions/groups */
export function createFeatureGroup(input: FeatureGroupDefinitionCreateDto) {
  return apiRequest<FeatureGroupDefinitionDto>('/api/feature-management/definitions/groups', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/feature-management/definitions/groups/{name} — chỉ displayName + concurrencyStamp. */
export function updateFeatureGroup(name: string, input: FeatureGroupDefinitionUpdateDto) {
  return apiRequest<FeatureGroupDefinitionDto>(
    `/api/feature-management/definitions/groups/${encodeURIComponent(name)}`,
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/feature-management/definitions/groups/{name} */
export function deleteFeatureGroup(name: string) {
  return apiRequest<void>(`/api/feature-management/definitions/groups/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}
