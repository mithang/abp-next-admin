import type { RouteRecordRaw } from 'vue-router';

import { mergeRouteModules, traverseTreeValues } from '@vben/utils';

import { coreRoutes, fallbackNotFoundRoute } from './core';

const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', {
  eager: true,
});

// Nếu cần có thể tự mở comment và tạo thư mục
// const externalRouteFiles = import.meta.glob('./external/**/*.ts', { eager: true });
// const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true });

/** Route động */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/** Danh sách route ngoài, truy cập các trang này có thể không cần Layout, có thể dùng để nhúng trong hệ thống khác (sẽ không hiển thị trong menu) */
// const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles);
// const staticRoutes: RouteRecordRaw[] = mergeRouteModules(staticRouteFiles);
const staticRoutes: RouteRecordRaw[] = [];
const externalRoutes: RouteRecordRaw[] = [];

/** Danh sách route, gồm route cơ bản, route ngoài và route 404 dự phòng
 *  Không cần đi qua xác thực quyền (sẽ luôn hiển thị trong menu) */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...externalRoutes,
  fallbackNotFoundRoute,
];

/** Danh sách route cơ bản, các route này không cần đi vào chặn quyền */
const coreRouteNames = traverseTreeValues(coreRoutes, (route) => route.name);

/** Danh sách route có kiểm tra quyền, gồm route động và route tĩnh */
const accessRoutes = [...dynamicRoutes, ...staticRoutes];

const componentKeys: string[] = Object.keys(
  import.meta.glob('../../views/**/*.vue'),
)
  .filter((item) => !item.includes('/modules/'))
  .map((v) => {
    const path = v.replace('../../views/', '/');
    return path.endsWith('.vue') ? path.slice(0, -4) : path;
  });

export { accessRoutes, componentKeys, coreRouteNames, routes };
