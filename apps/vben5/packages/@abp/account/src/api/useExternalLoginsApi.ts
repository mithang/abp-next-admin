import type {
  ExternalLoginResultDto,
  RemoveExternalLoginInput,
  WorkWeixinLoginBindInput,
} from '../types/external-logins';

import { useRequest } from '@abp/request';

export function useExternalLoginsApi() {
  const { cancel, request } = useRequest();

  /**
   * Liên kết WeChat doanh nghiệp
   * @param input Tham số liên kết
   * @returns { Promise<void> }
   */
  async function bindWorkWeixinApi(
    input: WorkWeixinLoginBindInput,
  ): Promise<void> {
    return await request(`/api/account/oauth/work-weixin/bind`, {
      method: 'POST',
      data: input,
    });
  }

  /**
   * Lấy danh sách nhà cung cấp đăng nhập bên ngoài
   * @returns Danh sách nhà cung cấp đăng nhập bên ngoài
   */
  async function getExternalLoginsApi(): Promise<ExternalLoginResultDto> {
    return await request<ExternalLoginResultDto>(
      `/api/account/external-logins`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Xóa nhà cung cấp đăng nhập bên ngoài
   * @returns { Promise<void> }
   */
  async function removeExternalLoginApi(
    input: RemoveExternalLoginInput,
  ): Promise<void> {
    return await request(`/api/account/external-logins/remove`, {
      method: 'DELETE',
      params: input,
    });
  }

  return {
    cancel,
    bindWorkWeixinApi,
    getExternalLoginsApi,
    removeExternalLoginApi,
  };
}
