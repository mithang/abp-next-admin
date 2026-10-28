import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  /** Tập hợp màu huy hiệu */
  export const BadgeVariants = [
    'default',
    'destructive',
    'primary',
    'success',
    'warning',
  ] as const;
  /** Tập hợp loại huy hiệu */
  export const BadgeTypes = ['dot', 'normal'] as const;
  /** Tập hợp loại menu */
  export const MenuTypes = [
    'catalog',
    'menu',
    'embedded',
    'link',
    'button',
  ] as const;
  /** Menu hệ thống */
  export interface SystemMenu {
    [key: string]: any;
    /** Mã định danh quyền backend */
    authCode: string;
    /** Cấp con */
    children?: SystemMenu[];
    /** Component */
    component?: string;
    /** ID menu */
    id: string;
    /** Metadata menu */
    meta?: {
      /** Biểu tượng hiển thị khi kích hoạt */
      activeIcon?: string;
      /** Path của menu cần kích hoạt khi đóng vai trò route */
      activePath?: string;
      /** Ghim trên thanh tab */
      affixTab?: boolean;
      /** Thứ tự ghim trên thanh tab */
      affixTabOrder?: number;
      /** Nội dung huy hiệu (có hiệu lực khi loại huy hiệu là normal) */
      badge?: string;
      /** Loại huy hiệu */
      badgeType?: (typeof BadgeTypes)[number];
      /** Màu huy hiệu */
      badgeVariants?: (typeof BadgeVariants)[number];
      /** Ẩn cấp dưới trong menu */
      hideChildrenInMenu?: boolean;
      /** Ẩn trong breadcrumb */
      hideInBreadcrumb?: boolean;
      /** Ẩn trong menu */
      hideInMenu?: boolean;
      /** Ẩn trên thanh tab */
      hideInTab?: boolean;
      /** Biểu tượng menu */
      icon?: string;
      /** URL của Iframe nhúng */
      iframeSrc?: string;
      /** Có lưu cache trang hay không */
      keepAlive?: boolean;
      /** URL của trang liên kết ngoài */
      link?: string;
      /** Số tab tối đa được mở của cùng một route */
      maxNumOfOpenTab?: number;
      /** Không cần bố cục cơ sở */
      noBasicLayout?: boolean;
      /** Có mở trong cửa sổ mới hay không */
      openInNewWindow?: boolean;
      /** Thứ tự sắp xếp menu */
      order?: number;
      /** Tham số route bổ sung */
      query?: Recordable<any>;
      /** Tiêu đề menu */
      title?: string;
    };
    /** Tên menu */
    name: string;
    /** Đường dẫn route */
    path: string;
    /** ID cấp cha */
    pid: string;
    /** Chuyển hướng */
    redirect?: string;
    /** Loại menu */
    type: (typeof MenuTypes)[number];
  }
}

/**
 * Lấy danh sách dữ liệu menu
 */
async function getMenuList() {
  return requestClient.get<Array<SystemMenuApi.SystemMenu>>(
    '/system/menu/list',
  );
}

async function isMenuNameExists(
  name: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get<boolean>('/system/menu/name-exists', {
    params: { id, name },
  });
}

async function isMenuPathExists(
  path: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get<boolean>('/system/menu/path-exists', {
    params: { id, path },
  });
}

/**
 * Tạo menu
 * @param data Dữ liệu menu
 */
async function createMenu(
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.post('/system/menu', data);
}

/**
 * Cập nhật menu
 *
 * @param id ID menu
 * @param data Dữ liệu menu
 */
async function updateMenu(
  id: string,
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.put(`/system/menu/${id}`, data);
}

/**
 * Xóa menu
 * @param id ID menu
 */
async function deleteMenu(id: string) {
  return requestClient.delete(`/system/menu/${id}`);
}

export {
  createMenu,
  deleteMenu,
  getMenuList,
  isMenuNameExists,
  isMenuPathExists,
  updateMenu,
};
