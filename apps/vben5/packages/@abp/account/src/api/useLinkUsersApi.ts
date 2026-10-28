import type { ListResultDto } from '@abp/core';

import type { LinkUserDto, UnLinkUserInput } from '../types/link-user';

import { useRequest } from '@abp/request';

export function useLinkUsersApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn danh sách người dùng liên kết
   * @returns { Promise<ListResultDto<LinkUserDto>> } Danh sách người dùng liên kết
   */
  function getListApi(): Promise<ListResultDto<LinkUserDto>> {
    return request<ListResultDto<LinkUserDto>>('api/account/link-users', {
      method: 'GET',
    });
  }
  /**
   * Tạo token người dùng liên kết
   */
  function generateLinkTokenApi(): Promise<string> {
    return request(`api/account/link-users/generate-link-token`, {
      method: 'POST',
    });
  }
  /**
   * Tạo token đăng nhập người dùng liên kết
   */
  function generateLinkLoginTokenApi(): Promise<string> {
    return request(`api/account/link-users/generate-link-login-token`, {
      method: 'POST',
    });
  }

  /**
   * Hủy liên kết người dùng
   * @param input Tham số
   */
  function unLinkApi(input: UnLinkUserInput): Promise<void> {
    return request(`api/account/link-users/unlink`, {
      method: 'POST',
      data: input,
    });
  }

  return {
    cancel,
    getListApi,
    generateLinkTokenApi,
    generateLinkLoginTokenApi,
    unLinkApi,
  };
}
