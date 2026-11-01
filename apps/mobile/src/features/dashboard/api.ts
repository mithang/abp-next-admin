import { apiRequest, type ListResult } from '../../lib/api-client';

export interface MenuDto {
  id?: string;
  name?: string;
  displayName?: string;
  path?: string;
  component?: string;
  icon?: string;
  parentId?: string;
  children?: MenuDto[];
}

/** GET /api/platform/menus/all — nguồn của feature-inventory (76 mục). */
export function getAllMenus() {
  return apiRequest<ListResult<MenuDto>>('/api/platform/menus/all', { method: 'GET' });
}
