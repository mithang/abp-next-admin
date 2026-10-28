import type { ApplicationConfigurationDto } from '@abp/core';

import { useRequest } from '@abp/request';

export function useAbpConfigApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy thông tin cấu hình ứng dụng
   */
  function getConfigApi(options?: {
    includeLocalizationResources?: boolean;
  }): Promise<ApplicationConfigurationDto> {
    return request<ApplicationConfigurationDto>(
      '/api/abp/application-configuration',
      {
        params: options,
        method: 'GET',
      },
    );
  }

  return {
    cancel,
    getConfigApi,
  };
}
