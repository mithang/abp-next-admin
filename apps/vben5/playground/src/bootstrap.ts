import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { registerLoadingDirective } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';

import { useTitle } from '@vueuse/core';

import { $t, setupI18n } from '#/locales';
import { router } from '#/router';

import { initComponentAdapter } from './adapter/component';
import { initSetupVbenForm } from './adapter/form';
import App from './app.vue';
import { initTimezone } from './timezone-init';

async function bootstrap(namespace: string) {
  // Khởi tạo bộ điều hợp component
  await initComponentAdapter();

  // Khởi tạo component biểu mẫu
  await initSetupVbenForm();

  // Đặt cấu hình mặc định cho popup
  // setDefaultModalProps({
  //   fullscreenButton: false,
  // });
  // Đặt cấu hình mặc định cho drawer
  // setDefaultDrawerProps({
  //   zIndex: 1020,
  // });

  const app = createApp(App);

  // Đăng kýv-loadingdirective
  registerLoadingDirective(app, {
    loading: 'loading', // Tại đây có thể tùy chỉnh tên directive，cũng có thể cung cấp rõ ràngfalsebiểu thị không đăng ký directive này
    spinning: 'spinning',
  });

  // Cấu hình i18n quốc tế hóa
  await setupI18n(app);

  // Cấu hình pinia-tore
  await initStores(app, { namespace });

  // Khởi tạo múi giờHANDLER
  initTimezone();

  // Cài đặt directive quyền
  registerAccessDirective(app);

  // Khởi tạo tippy
  const { initTippy } = await import('@vben/common-ui/es/tippy');
  initTippy(app);

  // Cấu hình route và route guard
  app.use(router);

  // Cấu hình @tanstack/vue-query
  const { VueQueryPlugin } = await import('@tanstack/vue-query');
  app.use(VueQueryPlugin);

  // Cấu hìnhMotionplugin
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
