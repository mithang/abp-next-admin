import type { BasicUserInfo } from '@vben-core/typings';

/** Thông tin người dùng */
interface UserInfo extends BasicUserInfo {
  /**
   * Mô tả người dùng
   */
  desc: string;
  /**
   * Địa chỉ trang chủ
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;
}

export type { UserInfo };
