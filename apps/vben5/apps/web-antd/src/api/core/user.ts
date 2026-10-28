import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * Lấy thông tin người dùng
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}
