import type { ApplicationLocalizationDto } from '@abp/core';

import { useRequest } from '@abp/request';

export function useLocalizationsApi() {
  const { cancel, request } = useRequest();
  /**
   * Lấy ngôn ngữ của ứng dụng
   * @returns Cấu hình bản địa hoá
   */
  function getLocalizationApi(options: {
    cultureName: string;
    onlyDynamics?: boolean;
  }): Promise<ApplicationLocalizationDto> {
    return request<ApplicationLocalizationDto>(
      '/api/abp/application-localization',
      {
        method: 'GET',
        params: options,
      },
    );
  }

  return {
    cancel,
    getLocalizationApi,
  };
}
