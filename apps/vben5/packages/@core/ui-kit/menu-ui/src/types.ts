import type { Component, Ref } from 'vue';

import type { MenuRecordBadgeRaw, ThemeModeType } from '@vben-core/typings';

interface MenuProps {
  /**
   * @zh_CN Có bật chế độ accordion không
   * @default true
   */
  accordion?: boolean;
  /**
   * @zh_CN Menu có thu gọn không
   * @default false
   */
  collapse?: boolean;

  /**
   * @zh_CN Khi menu thu gọn có hiển thị tên menu không
   * @default false
   */
  collapseShowTitle?: boolean;

  /**
   * @zh_CN Menu được kích hoạt mặc định
   */
  defaultActive?: string;

  /**
   * @zh_CN Menu được mở rộng mặc định
   */
  defaultOpeneds?: string[];

  /**
   * @zh_CN Chế độ menu
   * @default vertical
   */
  mode?: 'horizontal' | 'vertical';

  /**
   * @zh_CN Có phải phong cách bo tròn không
   * @default true
   */
  rounded?: boolean;

  /**
   * @zh_CN Có tự động cuộn đến mục menu đang kích hoạt không
   * @default false
   */
  scrollToActive?: boolean;

  /**
   * @zh_CN Chủ đề menu
   * @default dark
   */
  theme?: ThemeModeType;
}

interface SubMenuProps extends MenuRecordBadgeRaw {
  /**
   * @zh_CN Biểu tượng kích hoạt
   */
  activeIcon?: string;
  /**
   * @zh_CN Có bị vô hiệu hóa không
   */
  disabled?: boolean;
  /**
   * @zh_CN Biểu tượng
   */
  icon?: Component | string;
  /**
   * @zh_CN Tên submenu
   */
  path: string;
}

interface MenuItemProps extends MenuRecordBadgeRaw {
  /**
   * @zh_CN Biểu tượng
   */
  activeIcon?: string;
  /**
   * @zh_CN Có bị vô hiệu hóa không
   */
  disabled?: boolean;
  /**
   * @zh_CN Biểu tượng
   */
  icon?: Component | string;
  /**
   * @zh_CN Tên menuitem
   */
  path: string;
}

interface MenuItemRegistered {
  active: boolean;
  parentPaths: string[];
  path: string;
}

interface MenuItemClicked {
  parentPaths: string[];
  path: string;
}

interface MenuProvider {
  activePath?: string;
  addMenuItem: (item: MenuItemRegistered) => void;

  addSubMenu: (item: MenuItemRegistered) => void;
  closeMenu: (path: string, parentLinks: string[]) => void;
  handleMenuItemClick: (item: MenuItemClicked) => void;
  handleSubMenuClick: (subMenu: MenuItemRegistered) => void;
  isMenuPopup: boolean;
  items: Record<string, MenuItemRegistered>;

  openedMenus: string[];
  openMenu: (path: string, parentLinks: string[]) => void;
  props: MenuProps;
  removeMenuItem: (item: MenuItemRegistered) => void;

  removeSubMenu: (item: MenuItemRegistered) => void;

  subMenus: Record<string, MenuItemRegistered>;
  theme: string;
}

interface SubMenuProvider {
  addSubMenu: (item: MenuItemRegistered) => void;
  handleMouseleave?: (deepDispatch: boolean) => void;
  level: number;
  mouseInChild: Ref<boolean>;
  removeSubMenu: (item: MenuItemRegistered) => void;
}

export type {
  MenuItemClicked,
  MenuItemProps,
  MenuItemRegistered,
  MenuProps,
  MenuProvider,
  SubMenuProps,
  SubMenuProvider,
};
