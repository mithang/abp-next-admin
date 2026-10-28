import type { RouteRecordRaw } from 'vue-router';

// Định nghĩa kiểu module
interface RouteModuleType {
  default: RouteRecordRaw[];
}

/**
 * Gộp các export mặc định của module route động
 * @param routeModules Đối tượng module route được import động
 * @returns Mảng cấu hình route sau khi gộp
 */
function mergeRouteModules(
  routeModules: Record<string, unknown>,
): RouteRecordRaw[] {
  const mergedRoutes: RouteRecordRaw[] = [];

  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = (routeModule as RouteModuleType)?.default ?? [];
    mergedRoutes.push(...moduleRoutes);
  }

  return mergedRoutes;
}

export { mergeRouteModules };

export type { RouteModuleType };
