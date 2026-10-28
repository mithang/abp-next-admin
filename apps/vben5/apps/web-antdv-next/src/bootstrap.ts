import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { registerLoadingDirective } from '@vben/common-ui/es/loading';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antdv-next';

import { useTitle } from '@vueuse/core';

import { $t, setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import { initSetupVbenForm } from './adapter/form';
import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  // Khởi tạo adapter cho component
  await initComponentAdapter();

  // Khởi tạo component biểu mẫu
  await initSetupVbenForm();

  // // Thiết lập cấu hình mặc định cho hộp thoại popup
  // setDefaultModalProps({
  //   fullscreenButton: false,
  // });
  // // Thiết lập cấu hình mặc định cho ngăn kéo (drawer)
  // setDefaultDrawerProps({
  //   zIndex: 1020,
  // });

  const app = createApp(App);

  // Đăng ký directive v-loading
  registerLoadingDirective(app, {
    loading: 'loading', // Tại đây có thể tùy chỉnh tên directive, cũng có thể truyền rõ false để không đăng ký directive này
    spinning: 'spinning',
  });

  // Cấu hình quốc tế hóa i18n
  await setupI18n(app);

  // Cấu hình pinia store
  await initStores(app, { namespace });

  // Cài đặt directive phân quyền
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
