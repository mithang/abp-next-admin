import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { registerLoadingDirective } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/ele';

import { useTitle } from '@vueuse/core';
import { ElLoading } from 'element-plus';

import { $t, setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import { initSetupVbenForm } from './adapter/form';
import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  // Khởi tạo adapter component
  await initComponentAdapter();

  // Khởi tạo component form
  await initSetupVbenForm();

  // // Đặt cấu hình mặc định của popup
  // setDefaultModalProps({
  //   fullscreenButton: false,
  // });
  // // Đặt cấu hình mặc định của drawer
  // setDefaultDrawerProps({
  //   zIndex: 2000,
  // });
  const app = createApp(App);

  // Đăng ký directive v-loading do Element Plus cung cấp
  app.directive('loading', ElLoading.directive);

  // Đăng ký directive v-loading và v-spinning do Vben cung cấp
  registerLoadingDirective(app, {
    loading: false, // Chỉ cần chọn một trong hai directive v-loading do Vben cung cấp và directive v-loading do Element Plus cung cấp, false tại đây nghĩa là không đăng ký directive v-loading do Vben cung cấp
    spinning: 'spinning',
  });

  // Cấu hình quốc tế hóa i18n
  await setupI18n(app);

  // Cấu hình pinia store
  await initStores(app, { namespace });

  // Cài đặt directive quyền
  registerAccessDirective(app);

  // Khởi tạo tippy
  const { initTippy } = await import('@vben/common-ui/es/tippy');
  initTippy(app);

  // Cấu hình route và route guard
  app.use(router);

  // Cấu hình plugin Motion
  const { MotionPlugin } = await import('@vben/plugins/motion');
  app.use(MotionPlugin);

  // Cập nhật tiêu đề động
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

export { bootstrap };
