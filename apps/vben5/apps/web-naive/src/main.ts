import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

/**
 * Sau khi khởi tạo ứng dụng xong mới tiến hành tải và render trang
 */
async function initApplication() {
  // name dùng để chỉ định định danh duy nhất của dự án
  // Dùng để phân biệt preference của các dự án khác nhau, tiền tố key dữ liệu lưu trữ và một số dữ liệu khác cần cách ly
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;

  // Khởi tạo preference của app
  await initPreferences({
    namespace,
    overrides: overridesPreferences,
  });

  // Khởi động và mount ứng dụng
  // Logic chính và view của ứng dụng vue
  const { bootstrap } = await import('./bootstrap');
  await bootstrap(namespace);

  // Gỡ bỏ và hủy loading
  unmountGlobalLoading();
}

initApplication();
