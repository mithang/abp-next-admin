/**
 * Kiểu cho nhóm Quản lý cache, đối chiếu trực tiếp backend
 * LINGYUN.Abp.CachingManagement (Application.Contracts), không chỉ copy web:
 * - GET /api/caching-management/cache/keys trả CacheKeysDto { keys, nextMarker }
 *   (phân trang bằng marker, KHÔNG phải skipCount/maxResultCount như ABP thường).
 * - GET .../value trả CacheValueDto { type, size, expiration, values }.
 * - PUT .../set, PUT .../refresh, DELETE .../remove (query key),
 *   DELETE .../bulk/remove (body { keys }).
 * Web dùng cùng prefix qua @abp/cache-management (useCacheManagementApi).
 */

export interface GetCacheKeysInput {
  filter?: string;
  marker?: string;
  prefix?: string;
}

export interface CacheKeysDto {
  keys: string[];
  nextMarker?: string | null;
}

export interface CacheKeyInput {
  key: string;
}

export interface CacheValueDto {
  type: string;
  size: number;
  expiration?: string | null;
  values: Record<string, unknown>;
}

export interface CacheSetInput {
  key: string;
  value?: string;
  absoluteExpiration?: string;
  slidingExpiration?: string;
}

export interface CacheRefreshInput {
  key: string;
  absoluteExpiration?: string;
  slidingExpiration?: string;
}

export interface CacheRemoveKeysInput {
  keys: string[];
}
