import type { OpenIdConfiguration } from '@abp/core';

import { useRequest } from '@abp/request';

export function useOpenIdApi() {
  const { cancel, request } = useRequest();

  /**
   * Endpoint discovery của openid
   * @returns Dữ liệu cấu hình OpenId
   */
  function discoveryApi(): Promise<OpenIdConfiguration> {
    return request<OpenIdConfiguration>('/.well-known/openid-configuration', {
      method: 'GET',
    });
  }

  return {
    cancel,
    discoveryApi,
  };
}
