import type { VNode } from 'vue';
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';

import { computed } from 'vue';

import { preferences, usePreferences } from '@vben/preferences';

/**
 * Chuyển đổi component, tự động thêm name
 * @param component
 * @param route
 */
export function transformComponent(
  component: VNode,
  route: RouteLocationNormalizedLoadedGeneric,
) {
  // Không tìm thấy view của component, nếu đã đặt view dự phòng thì trả về view dự phòng, nếu không thì ném ra lỗi
  if (!component) {
    console.error(
      'Component view not found，please check the route configuration',
    );
    return undefined;
  }

  const routeName = route.name as string;
  // Nếu component không có name thì trả về trực tiếp
  if (!routeName) {
    return component;
  }
  const componentName = (component?.type as any)?.name;

  // Đã đặt name rồi thì trả về trực tiếp
  if (componentName) {
    return component;
  }

  // componentName và routeName giống nhau thì trả về trực tiếp
  if (componentName === routeName) {
    return component;
  }

  // Đặt name
  component.type ||= {};
  (component.type as any).name = routeName;

  return component;
}

/**
 * Hook liên quan đến Layout
 */
export function useLayoutHook() {
  const { keepAlive } = usePreferences();
  /**
   * Có sử dụng animation hay không
   */
  const getEnabledTransition = computed(() => {
    const { transition } = preferences;
    const transitionName = transition.name;
    return transitionName && transition.enable;
  });

  /**
   * Lấy animation chuyển đổi route
   * @param _route
   */
  function getTransitionName(_route: RouteLocationNormalizedLoaded) {
    // Nếu cài đặt tùy chọn chưa được đặt thì không dùng animation
    const { tabbar, transition } = preferences;
    const transitionName = transition.name;
    if (!transitionName || !transition.enable) {
      return;
    }

    // Nếu tab chưa được bật hoặc chưa bật cache thì dùng animation cấu hình toàn cục
    if (!tabbar.enable || !keepAlive) {
      return transitionName;
    }

    // Nếu trang đã được tải rồi thì không dùng animation
    // if (route.meta.loaded) {
    //   return;
    // }
    // Trang đã mở và đã tải rồi thì không dùng animation
    // const inTabs = getCachedTabs.value.includes(route.name as string);

    // return inTabs && route.meta.loaded ? undefined : transitionName;
    return transitionName;
  }

  return {
    getEnabledTransition,
    getTransitionName,
  };
}
