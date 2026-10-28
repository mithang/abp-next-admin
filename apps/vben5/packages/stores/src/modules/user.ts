import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * Ảnh đại diện
   */
  avatar: string;
  /**
   * Biệt danh người dùng
   */
  realName: string;
  /**
   * Vai trò người dùng
   */
  roles?: string[];
  /**
   * Id người dùng
   */
  userId: string;
  /**
   * Tên người dùng
   */
  username: string;
}

interface AccessState {
  /**
   * Thông tin người dùng
   */
  userInfo: BasicUserInfo | null;
  /**
   * Vai trò người dùng
   */
  userRoles: string[];
}

/**
 * @zh_CN Thông tin người dùng liên quan
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // Đặt thông tin người dùng
      this.userInfo = userInfo;
      // Đặt thông tin vai trò
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
  }),
});

// Khắc phục vấn đề cập nhật nóng
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
