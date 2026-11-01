import { apiRequest, type ListResult } from '../../lib/api-client';
import type {
  FeatureDefinitionCreateDto,
  FeatureDefinitionDto,
  FeatureDefinitionGetListInput,
  FeatureDefinitionUpdateDto,
} from './types';

/** GET /api/feature-management/definitions — web lọc filter/groupName, phân trang phía client. */
export function getFeatureDefinitions(input: FeatureDefinitionGetListInput = {}) {
  return apiRequest<ListResult<FeatureDefinitionDto>>('/api/feature-management/definitions', {
    method: 'GET',
    params: { filter: input.filter, groupName: input.groupName },
  });
}

/** GET /api/feature-management/definitions/{name} */
export function getFeatureDefinition(name: string) {
  return apiRequest<FeatureDefinitionDto>(
    `/api/feature-management/definitions/${encodeURIComponent(name)}`,
    { method: 'GET' },
  );
}

/** POST /api/feature-management/definitions */
export function createFeatureDefinition(input: FeatureDefinitionCreateDto) {
  return apiRequest<FeatureDefinitionDto>('/api/feature-management/definitions', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/feature-management/definitions/{name} — không gửi name/groupName. */
export function updateFeatureDefinition(name: string, input: FeatureDefinitionUpdateDto) {
  return apiRequest<FeatureDefinitionDto>(
    `/api/feature-management/definitions/${encodeURIComponent(name)}`,
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/feature-management/definitions/{name} */
export function deleteFeatureDefinition(name: string) {
  return apiRequest<void>(`/api/feature-management/definitions/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}
