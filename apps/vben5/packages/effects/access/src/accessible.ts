import type { Component, DefineComponent } from 'vue';

import type {
  AccessModeType,
  GenerateMenuAndRoutesOptions,
  RouteRecordRaw,
} from '@vben/types';

import { defineComponent, h } from 'vue';

import {
  cloneDeep,
  generateMenus,
  generateRoutesByBackend,
  generateRoutesByFrontend,
  isFunction,
  isString,
  mapTree,
} from '@vben/utils';

async function generateAccessible(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
) {
  const { router } = options;

  options.routes = cloneDeep(options.routes);
  // Tạo route
  const accessibleRoutes = await generateRoutes(mode, options);

  const root = router.getRoutes().find((item) => item.path === '/');

  // Lấy danh sách tên route đã có
  const names = root?.children?.map((item) => item.name) ?? [];

  // Thêm động vào instance router
  accessibleRoutes.forEach((route) => {
    if (root && !route.meta?.noBasicLayout) {
      // Để tương thích với cách dùng của phiên bản trước, nếu chứa route con thì loại bỏ component để tránh xuất hiện nhiều lớp BasicLayout
      // Nếu dự án của bạn đã theo kịp sửa đổi lần này và đã loại bỏ mọi BasicLayout ở cấp đầu của menu tùy chỉnh thì có thể xóa đoạn code if này
      if (route.children && route.children.length > 0) {
        delete route.component;
      }
      // Dựa vào router name để xác định, nếu route đã tồn tại thì không thêm nữa
      if (names?.includes(route.name)) {
        // Tìm chỉ mục của route đã tồn tại và cập nhật, nếu không cập nhật sẽ gây ra việc khi chuyển người dùng thì thư mục cấp một không được cập nhật, homePath ở thư mục cấp hai gây ra lỗi 404
        const index = root.children?.findIndex(
          (item) => item.name === route.name,
        );
        if (index !== undefined && index !== -1 && root.children) {
          root.children[index] = route;
        }
      } else {
        root.children?.push(route);
      }
    } else {
      router.addRoute(route);
    }
  });

  if (root) {
    if (root.name) {
      router.removeRoute(root.name);
    }
    router.addRoute(root);
  }

  // Tạo menu
  const accessibleMenus = generateMenus(accessibleRoutes, options.router);

  return { accessibleMenus, accessibleRoutes };
}

/**
 * Generate routes
 * @param mode
 * @param options
 */
async function generateRoutes(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
) {
  const { forbiddenComponent, roles, routes } = options;

  let resultRoutes: RouteRecordRaw[] = routes;
  switch (mode) {
    case 'backend': {
      resultRoutes = await generateRoutesByBackend(options);
      break;
    }
    case 'frontend': {
      resultRoutes = await generateRoutesByFrontend(
        routes,
        roles || [],
        forbiddenComponent,
      );
      break;
    }
    case 'mixed': {
      const [frontend_resultRoutes, backend_resultRoutes] = await Promise.all([
        generateRoutesByFrontend(routes, roles || [], forbiddenComponent),
        generateRoutesByBackend(options),
      ]);

      resultRoutes = [...frontend_resultRoutes, ...backend_resultRoutes];
      break;
    }
  }

  /**
   * Điều chỉnh cây route, thực hiện các xử lý sau:
   * 1. Thêm redirect cho route chưa được thêm redirect
   * 2. Đổi tên component tải lười thành tên của route hiện tại (nếu đã bật keep-alive)
   */
  resultRoutes = mapTree(resultRoutes, (route) => {
    // Đóng gói lại component, dùng name giống với tên route để hỗ trợ bộ nhớ đệm có điều kiện của keep-alive.
    if (
      route.meta?.keepAlive &&
      isFunction(route.component) &&
      route.name &&
      isString(route.name)
    ) {
      const originalComponent = route.component as () => Promise<{
        default: Component | DefineComponent;
      }>;
      route.component = async () => {
        const component = await originalComponent();
        if (!component.default) return component;
        return defineComponent({
          name: route.name as string,
          setup(props, { attrs, slots }) {
            return () => h(component.default, { ...props, ...attrs }, slots);
          },
        });
      };
    }

    // Nếu có redirect hoặc không có route con thì trả về trực tiếp
    if (route.redirect || !route.children || route.children.length === 0) {
      return route;
    }
    const firstChild = route.children[0];

    // Nếu route con không bắt đầu bằng / thì trả về trực tiếp, trường hợp này cần tính toàn bộ path của các cấp cha mới ra được path chính xác, tại đây không xử lý
    if (!firstChild?.path || !firstChild.path.startsWith('/')) {
      return route;
    }

    route.redirect = firstChild.path;
    return route;
  });

  return resultRoutes;
}

export { generateAccessible };
