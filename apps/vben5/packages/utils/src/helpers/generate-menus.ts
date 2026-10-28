import type { Router, RouteRecordRaw } from 'vue-router';

import type {
  ExRouteRecordRaw,
  MenuRecordRaw,
  RouteMeta,
} from '@vben-core/typings';

import { filterTree, mapTree, sortTree } from '@vben-core/shared/utils';

/**
 * Tạo danh sách menu theo routes
 * @param routes - Danh sách cấu hình route
 * @param router - Thể hiện Vue Router
 * @returns Danh sách menu đã tạo
 */
function generateMenus(
  routes: RouteRecordRaw[],
  router: Router,
): MenuRecordRaw[] {
  // Chuyển danh sách route thành một ánh xạ đối tượng với name làm khóa
  const finalRoutesMap: { [key: string]: string } = Object.fromEntries(
    router.getRoutes().map(({ name, path }) => [name, path]),
  );

  let menus = mapTree<ExRouteRecordRaw, MenuRecordRaw>(routes, (route) => {
    // Lấy đường dẫn route cuối cùng
    const path = finalRoutesMap[route.name as string] ?? route.path ?? '';

    const {
      meta = {} as RouteMeta,
      name: routeName,
      redirect,
      children = [],
    } = route;
    const {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      hideChildrenInMenu = false,
      icon,
      link,
      order,
      title = '',
    } = meta;

    // Đảm bảo tên menu không rỗng
    const name = (title || routeName || '') as string;

    // Xử lý menu con
    const resultChildren = hideChildrenInMenu
      ? []
      : ((children as MenuRecordRaw[]) ?? []);

    // Đặt quan hệ cha-con của menu con
    if (resultChildren.length > 0) {
      resultChildren.forEach((child) => {
        child.parents = [...(route.parents ?? []), path];
        child.parent = path;
      });
    }

    // Xác định đường dẫn cuối cùng
    const resultPath = hideChildrenInMenu ? redirect || path : link || path;

    return {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      icon,
      name,
      order,
      parent: route.parent,
      parents: route.parents,
      path: resultPath,
      show: !meta.hideInMenu,
      children: resultChildren,
    };
  });

  // Sắp xếp menu, tránh vấn đề order=0 bị thay thành 999
  menus = sortTree(menus, (a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  // Lọc bỏ các mục menu bị ẩn
  return filterTree(menus, (menu) => !!menu.show);
}

export { generateMenus };
