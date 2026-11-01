import { apiRequest } from '../../lib/api-client';
import type {
  CacheKeyInput,
  CacheKeysDto,
  CacheRefreshInput,
  CacheRemoveKeysInput,
  CacheSetInput,
  CacheValueDto,
  GetCacheKeysInput,
} from './types';

const BASE = '/api/caching-management/cache';

/** GET {BASE}/keys — phân trang bằng marker (nextMarker), lọc filter/prefix. */
export function getCacheKeys(input: GetCacheKeysInput = {}) {
  return apiRequest<CacheKeysDto>(`${BASE}/keys`, {
    method: 'GET',
    params: {
      filter: input.filter,
      marker: input.marker,
      prefix: input.prefix,
    },
  });
}

/** GET {BASE}/value?key=... — giá trị của một khóa. */
export function getCacheValue(input: CacheKeyInput) {
  return apiRequest<CacheValueDto>(`${BASE}/value`, {
    method: 'GET',
    params: { key: input.key },
  });
}

/** PUT {BASE}/set — đặt giá trị cho khóa (key bắt buộc, value tùy chọn). */
export function setCacheValue(input: CacheSetInput) {
  return apiRequest<void>(`${BASE}/set`, { method: 'PUT', body: input });
}

/** PUT {BASE}/refresh — làm mới khóa (chỉ đổi hạn, không đổi giá trị). */
export function refreshCacheKey(input: CacheRefreshInput) {
  return apiRequest<void>(`${BASE}/refresh`, { method: 'PUT', body: input });
}

/** DELETE {BASE}/remove?key=... — xóa một khóa. */
export function removeCacheKey(input: CacheKeyInput) {
  return apiRequest<void>(`${BASE}/remove`, {
    method: 'DELETE',
    params: { key: input.key },
  });
}

/** DELETE {BASE}/bulk/remove — xóa hàng loạt, body { keys } (web gửi data). */
export function removeCacheKeys(input: CacheRemoveKeysInput) {
  return apiRequest<void>(`${BASE}/bulk/remove`, { method: 'DELETE', body: input });
}
