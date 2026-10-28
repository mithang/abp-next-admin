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
    // Ghi lại trang đã tải hay chưa, nếu đã tải thì các hiệu ứng chuyển trang tiếp theo sẽ không thực thi lặp lại
    loadedPaths.add(to.path);

    // Đóng thanh tiến trình tải trang
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * Cấu hình guard truy cập theo quyền
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();
    // Các route cơ bản, những route này không cần đi qua chặn quyền
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
      // Khai báo rõ ràng bỏ qua quyền truy cập, thì có thể truy cập
      if (to.meta.ignoreAccess) {
        return true;
      }

      // Không có quyền truy cập, chuyển hướng tới trang đăng nhập
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // Nếu không cần, xóa trực tiếp query
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          // Mang theo trang đang chuyển hướng tới, sau khi đăng nhập sẽ chuyển hướng lại tới trang đó
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
    // Danh sách định danh vai trò mà người dùng đang đăng nhập sở hữu
    const userInfo = userStore.userInfo || (await authStore.fetchUserInfo());
    const userRoles = userInfo.roles ?? [];

    // Tạo menu và route
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: userRoles,
      router,
      // Thì sẽ hiển thị trong menu, nhưng khi truy cập sẽ bị chuyển hướng tới 403
      routes: accessRoutes,
    });

    // Lưu thông tin menu và thông tin route
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);
    let redirectPath: string;
    if (from.query.redirect) {
      redirectPath = from.query.redirect as string;
    } else if (to.fullPath === preferences.app.defaultHomePath) {
      redirectPath = preferences.app.defaultHomePath;
    } else if (userInfo.homePath && to.fullPath === userInfo.homePath) {
      redirectPath = userInfo.homePath;
    } else {
      redirectPath = to.fullPath;
    }
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
  /** Truy cập theo quyền */
  setupAccessGuard(router);
}

export { createRouterGuard };
