interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
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
   * Tên đăng nhập
   */
  username: string;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
