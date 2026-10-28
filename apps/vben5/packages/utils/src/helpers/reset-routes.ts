import type { Router, RouteRecordName, RouteRecordRaw } from 'vue-router';

import { traverseTreeValues } from '@vben-core/shared/utils';

/**
 * @zh_CN Đặt lại tất cả các route, ngoại trừ các route được chỉ định trong danh sách trắng
 */
export function resetStaticRoutes(router: Router, routes: RouteRecordRaw[]) {
  // Lấy name của tất cả các nút (bao gồm nút con) của route tĩnh, loại trừ các route không có trường name
  const staticRouteNames = traverseTreeValues<
    RouteRecordRaw,
    RouteRecordName | undefined
  >(routes, (route) => {
    // Các route này cần chỉ định name, để khi đặt lại route vẫn xóa được các route không có name
    if (!route.name) {
      console.warn(
        `The route with the path ${route.path} needs to have the field name specified.`,
      );
    }
    return route.name;
  });

  const { getRoutes, hasRoute, removeRoute } = router;
  const allRoutes = getRoutes();
  allRoutes.forEach(({ name }) => {
    // Chỉ xóa khi route tồn tại trong bảng route và không thuộc danh sách trắng
    if (name && !staticRouteNames.includes(name) && hasRoute(name)) {
      removeRoute(name);
    }
  });
}
