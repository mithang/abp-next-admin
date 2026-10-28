import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

/**
 * Mở rộng đối tượng gốc của route
 */
type ExRouteRecordRaw = RouteRecordRaw & {
  parent?: string;
  parents?: string[];
  path?: any;
};

interface MenuRecordBadgeRaw {
  /**
   * Huy hiệu
   */
  badge?: string;
  /**
   * Loại huy hiệu
   */
  badgeType?: 'dot' | 'normal';
  /**
   * Màu huy hiệu
   */
  badgeVariants?: 'destructive' | 'primary' | string;
}

/**
 * Đối tượng gốc của menu
 */
interface MenuRecordRaw extends MenuRecordBadgeRaw {
  /**
   * Tên biểu tượng khi kích hoạt
   */
  activeIcon?: string;
  /**
   * Menu con
   */
  children?: MenuRecordRaw[];
  /**
   * Có vô hiệu hóa menu không
   * @default false
   */
  disabled?: boolean;
  /**
   * Tên biểu tượng
   */
  icon?: Component | string;
  /**
   * Tên menu
   */
  name: string;
  /**
   * Số thứ tự
   */
  order?: number;
  /**
   * Đường dẫn cấp cha
   */
  parent?: string;
  /**
   * Tất cả đường dẫn cấp cha
   */
  parents?: string[];
  /**
   * Đường dẫn menu, duy nhất, có thể dùng làm key
   */
  path: string;
  /**
   * Có hiển thị menu không
   * @default true
   */
  show?: boolean;
}

export type { ExRouteRecordRaw, MenuRecordBadgeRaw, MenuRecordRaw };
