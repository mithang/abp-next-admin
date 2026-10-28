import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
} from '@vben/request';
import { useAccessStore, useTimezoneStore } from '@vben/stores';

import { useOAuthError } from '@abp/account';
import { useAbpStore } from '@abp/core';
import { requestClient, useWrapperResult } from '@abp/request';
import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

export function initRequestClient() {
  /**
   * Logic xác thực lại
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * Logic làm mới token
   */
  async function doRefreshToken() {
    const authStore = useAuthStore();
    try {
      const token = await authStore.refreshSession();
      return token ?? '';
    } catch {
      console.warn('The refresh token has expired or is unavailable.');
    }
    return '';
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }
  // Xử lý tiêu đề yêu cầu
  requestClient.addRequestInterceptor({
    fulfilled: async (config) => {
      const abpStore = useAbpStore();
      const accessStore = useAccessStore();
      const timezoneStore = useTimezoneStore();

      if (accessStore.accessToken) {
        config.headers.Authorization = `${accessStore.accessToken}`;
      }
      config.headers['Accept-Language'] = preferences.app.locale;
      config.headers['X-Request-From'] = 'vben';
      if (abpStore.tenantId) {
        // see: https://github.com/abpframework/abp/blob/dev/framework/src/Volo.Abp.MultiTenancy.Abstractions/Volo/Abp/MultiTenancy/TenantResolverConsts.cs
        config.headers.__tenant = abpStore.tenantId;
      }
      if (abpStore.xsrfToken) {
        config.headers.RequestVerificationToken = abpStore.xsrfToken;
      }
      if (timezoneStore.timezone) {
        // see: https://github.com/abpframework/abp/blob/dev/framework/src/Volo.Abp.Timing/Volo/Abp/Timing/TimeZoneConsts.cs
        config.headers.__timezone = timezoneStore.timezone;
      }
      return config;
    },
  });

  // Giải cấu trúc dữ liệu response
  requestClient.addResponseInterceptor<any>({
    fulfilled: (response) => {
      const { data, status } = response;
      const { hasWrapResult, getData } = useWrapperResult(response);

      if (hasWrapResult()) {
        return getData();
      }

      if (status >= 200 && status < 400) {
        return data;
      }

      throw Object.assign({}, response, { response });
    },
  });

  // Xử lý khi token hết hạn
  requestClient.addResponseInterceptor(
    authenticateResponseInterceptor({
      client: requestClient,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // Xử lý lỗi chung, nếu không rơi vào logic xử lý lỗi phía trên thì sẽ vào đây
  requestClient.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // Tại đây có thể tùy chỉnh theo nghiệp vụ, bạn có thể lấy thông tin trong error để xử lý tùy chỉnh, đưa ra gợi ý khác nhau theo từng code thay vì dùng trực tiếp message.error để hiển thị msg
      // Trường lỗi mà API mock hiện tại trả về là error hoặc message
      const responseData = error?.response?.data ?? {};
      if (responseData?.error_description) {
        const { formatError } = useOAuthError();
        message.error(formatError(responseData) || msg);
        return;
      }
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      // Nếu không có thông tin lỗi, sẽ hiển thị gợi ý theo mã trạng thái
      message.error(errorMessage || msg);
    }),
  );
}
