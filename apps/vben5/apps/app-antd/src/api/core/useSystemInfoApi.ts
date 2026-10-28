import type { SystemInfo } from '#/types/systemInfo';

import { useRequest } from '@abp/request';

export function useSystemInfoApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy trạng thái ứng dụng
   */
  function getSystemInfoApi(): Promise<SystemInfo> {
    return request<SystemInfo>('/api/system-info', {
      method: 'GET',
    });
  }

  return {
    cancel,
    getSystemInfoApi,
  };
}
