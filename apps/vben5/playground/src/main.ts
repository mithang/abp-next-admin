import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

/**
 * Chỉ render tải trang sau khi khởi tạo ứng dụng xong
 */
async function initApplication() {
  // name dùng để chỉ định định danh duy nhất của dự án
  // Dùng để phân biệt cài đặt tùy chọn của các dự án khác nhau, tiền tố key lưu trữ dữ liệu và một số dữ liệu khác cần cách ly
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;

  // Khởi tạo cài đặt tùy chọn của app
  await initPreferences({
    namespace,
    overrides: overridesPreferences,
  });

  // Khởi động ứng dụng và mount
  // Logic chính và view của ứng dụng vue
  const { bootstrap } = await import('./bootstrap');
  await bootstrap(namespace);

  // Gỡ bỏ và hủy loading
  unmountGlobalLoading();
}

initApplication();
