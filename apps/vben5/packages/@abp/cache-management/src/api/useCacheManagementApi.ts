import type {
  CacheKeyInput,
  CacheKeysDto,
  CacheRefreshInput,
  CacheRemoveKeysInput,
  CacheSetInput,
  CacheValueDto,
  GetCacheKeysInput,
} from '../types';

import { useRequest } from '@abp/request';

/** Giao diện API quản lý cache */
export function useCacheManagementApi() {
  const apiPrefix = '/api/caching-management/cache';
  const { cancel, request } = useRequest();

  /**
   * Lấy tất cả các khóa cache
   * @param input Tham số
   */
  function getKeysApi(input?: GetCacheKeysInput): Promise<CacheKeysDto> {
    return request<CacheKeysDto>(`${apiPrefix}/keys`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Lấy giá trị cache
   * @param input Tham số
   */
  function getKeyValueApi(input: CacheKeyInput): Promise<CacheValueDto> {
    return request<CacheValueDto>(`${apiPrefix}/value`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * Đặt giá trị cache
   * @param input Tham số
   */
  function setValueApi(input: CacheSetInput): Promise<void> {
    return request(`${apiPrefix}/set`, {
      method: 'PUT',
      data: input,
    });
  }

  /**
   * Làm mới cache
   * @param input Tham số
   */
  function refreshApi(input: CacheRefreshInput): Promise<void> {
    return request(`${apiPrefix}/refresh`, {
      method: 'PUT',
      data: input,
    });
  }

  /**
   * Xóa cache
   * @param input Tham số
   */
  function removeApi(input: CacheKeyInput): Promise<void> {
    return request(`${apiPrefix}/remove`, {
      method: 'DELETE',
      params: input,
    });
  }

  /**
   * Xóa cache hàng loạt
   * @param input Tham số
   */
  function bulkRemoveApi(input: CacheRemoveKeysInput): Promise<void> {
    return request(`${apiPrefix}/bulk/remove`, {
      method: 'DELETE',
      data: input,
    });
  }

  return {
    cancel,
    getKeysApi,
    getKeyValueApi,
    refreshApi,
    setValueApi,
    removeApi,
    bulkRemoveApi,
  };
}
