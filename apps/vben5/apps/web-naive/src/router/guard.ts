import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { accessRoutes, coreRouteNames } from '#/router/routes';
import { useAuthStore } from '#/store';

import { generateAccess } from './access';

/**
 * Cấu hình guard chung
 * @param router
 */
function setupCommonGuard(router: Router) {
  // Ghi lại các trang đã tải
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // Thanh tiến trình tải trang
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // Ghi lại trang đã tải hay chưa, nếu đã tải thì các hiệu ứng chuyển trang sau đó sẽ không chạy lại

    loadedPaths.add(to.path);

    // Tắt thanh tiến trình tải trang
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * Cấu hình guard kiểm tra quyền truy cập
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();

    // Các route cơ bản, những route này không cần qua chặn quyền
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && accessStore.accessToken) {
        return decodeURIComponent(
          (to.query?.redirect as string) ||
            userStore.userInfo?.homePath ||
            preferences.app.defaultHomePath,
        );
      }
      return true;
    }

    // Kiểm tra accessToken
    if (!accessStore.accessToken) {
      // Nếu khai báo rõ là bỏ qua kiểm tra quyền truy cập thì được phép truy cập
      if (to.meta.ignoreAccess) {
        return true;
      }

      // Không có quyền truy cập thì chuyển sang trang đăng nhập
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // Nếu không cần thì xóa trực tiếp query
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          // Mang theo trang hiện tại đang chuyển tới, sau khi đăng nhập sẽ chuyển lại tới trang đó
          replace: true,
        };
      }
      return to;
    }

    // Đã tạo route động hay chưa
    if (accessStore.isAccessChecked) {
      return true;
    }
    // Tạo bảng route
    // Danh sách mã định danh vai trò mà người dùng đang đăng nhập sở hữu
    const userInfo = userStore.userInfo || (await authStore.fetchUserInfo());
    const userRoles = userInfo.roles ?? [];

    // Tạo menu và route
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: userRoles,
      router,
      // Thì sẽ hiển thị trong menu nhưng khi truy cập sẽ bị chuyển hướng tới 403
      routes: accessRoutes,
    });

    // Lưu thông tin menu và thông tin route
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);
    const redirectPath = (from.query.redirect ??
      (to.path === preferences.app.defaultHomePath
        ? userInfo.homePath || preferences.app.defaultHomePath
        : to.fullPath)) as string;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * Cấu hình guard của dự án
 * @param router
 */
function createRouterGuard(router: Router) {
  /** Chung */
  setupCommonGuard(router);
  /** Quyền truy cập */
  setupAccessGuard(router);
}

export { createRouterGuard };
