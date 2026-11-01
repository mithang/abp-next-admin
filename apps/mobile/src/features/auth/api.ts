import { apiRequest } from '../../lib/api-client';
import type { ProfileDto } from './types';

/** GET /api/account/my-profile — đã kiểm chứng từ useProfileApi.ts của web. */
export function getMyProfile() {
  return apiRequest<ProfileDto>('/api/account/my-profile', { method: 'GET' });
}
