import type { Component } from 'vue';
import type { Router, RouteRecordRaw } from 'vue-router';

interface RouteMeta {
  /**
   * Biểu tượng kích hoạt（menu/tab）
   */
  activeIcon?: string;
  /**
   * Menu đang kích hoạt hiện tại, đôi khi không muốn kích hoạt menu hiện có, dùng khi cần kích hoạt menu cha
   */
  activePath?: string;
  /**
   * Có cố định tab hay không
   * @default false
   */
  affixTab?: boolean;
  /**
   * Thứ tự của tab cố định
   * @default 0
   */
  affixTabOrder?: number;
  /**
   * Cần có mã định danh vai trò cụ thể mới có thể truy cập
   * @default []
   */
  authority?: string[];
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
  badgeVariants?:
    'default' | 'destructive' | 'primary' | 'success' | 'warning' | string;
  /**
   * DOM tương ứng của route có được lưu cache hay không
   */
  domCached?: boolean;
  /**
   * Đường dẫn đầy đủ của route làm key（mặc định true）
   */
  fullPathKey?: boolean;
  /**
   * Route con của route hiện tại không hiển thị trong menu
   * @default false
   */
  hideChildrenInMenu?: boolean;
  /**
   * Route hiện tại không hiển thị trong breadcrumb
   * @default false
   */
  hideInBreadcrumb?: boolean;
  /**
   * Route hiện tại không hiển thị trong menu
   * @default false
   */
  hideInMenu?: boolean;
  /**
   * Route hiện tại không hiển thị trong tab
   * @default false
   */
  hideInTab?: boolean;
  /**
   * Biểu tượng（menu/tab）
   */
  icon?: Component | string;
  /**
   * Địa chỉ iframe
   */
  iframeSrc?: string;
  /**
   * Bỏ qua quyền, có thể truy cập trực tiếp
   * @default false
   */
  ignoreAccess?: boolean;
  /**
   * Bật cache KeepAlive
   */
  keepAlive?: boolean;
  /**
   * Liên kết ngoài - đường dẫn chuyển hướng
   */
  link?: string;
  /**
   * Route đã được tải hay chưa
   */
  loaded?: boolean;
  /**
   * Số lượng tab mở tối đa
   * @default -1
   */
  maxNumOfOpenTab?: number;
  /**
   * Menu có thể nhìn thấy, nhưng khi truy cập sẽ bị chuyển hướng tới 403
   */
  menuVisibleWithForbidden?: boolean;
  /**
   * Không dùng bố cục cơ sở（chỉ có hiệu lực ở cấp cao nhất）
   */
  noBasicLayout?: boolean;
  /**
   * Mở trong cửa sổ mới
   */
  openInNewWindow?: boolean;
  /**
   * Dùng để sắp xếp route -> menu
   */
  order?: number;
  /**
   * Tham số mà menu mang theo
   */
  query?: Recordable;
  /**
   * Tên tiêu đề
   */
  title: string;
}

// Định nghĩa kiểu đệ quy để đổi thuộc tính component của RouteRecordRaw thành string
type RouteRecordStringComponent<T = string> = Omit<
  RouteRecordRaw,
  'children' | 'component'
> & {
  children?: RouteRecordStringComponent<T>[];
  component: T;
};

type ComponentRecordType = Record<string, () => Promise<Component>>;

interface GenerateMenuAndRoutesOptions {
  fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>;
  forbiddenComponent?: RouteRecordRaw['component'];
  layoutMap?: ComponentRecordType;
  pageMap?: ComponentRecordType;
  roles?: string[];
  router: Router;
  routes: RouteRecordRaw[];
}

export type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteMeta,
  RouteRecordRaw,
  RouteRecordStringComponent,
};
