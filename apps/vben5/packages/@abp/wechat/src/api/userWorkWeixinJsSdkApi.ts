import type { AgentConfigDto } from '../types/js-sdk';

import { useRequest } from '@abp/request';

export function userWorkWeixinJsSdkApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy cấu hình ứng dụng WeChat doanh nghiệp
   * @returns Dto cấu hình ứng dụng WeChat doanh nghiệp
   */
  function getAgentConfigApi(): Promise<AgentConfigDto> {
    return request<AgentConfigDto>(`/api/wechat/work/jssdk/agent-config`, {
      method: 'GET',
    });
  }

  return {
    cancel,
    getAgentConfigApi,
  };
}
