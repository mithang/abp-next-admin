// Cấu hình axios, có thể tự thay đổi theo dự án, chỉ cần thay đổi file này, các file khác không cần động tới
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkResponse } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getToken } from '/@/utils/auth';
import { useI18n } from '/@/hooks/web/useI18n';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { joinTimestamp, formatRequestDate } from './helper';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
import axios from 'axios';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: Xử lý dữ liệu, thuận tiện phân biệt nhiều cách xử lý
 */
const transform: AxiosTransform = {
  /**
   * @description: Xử lý dữ liệu yêu cầu. Nếu dữ liệu không đúng định dạng mong đợi, có thể ném lỗi trực tiếp
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isReturnNativeResponse } = options;
    // Có trả về response header gốc hay không, ví dụ: dùng thuộc tính này khi cần lấy response header
    if (isReturnNativeResponse) {
      return res;
    }

    const { data } = res;

    // Xử lý kết quả đã đóng gói
    if (res.headers['_abpwrapresult'] === 'true') {
      if (!data) {
        // return '[HTTP] Request has no return value';
        throw new Error(t('sys.api.apiRequestFailed'));
      }

      const { code, result, message, details } = data;
      const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.CODE;
      if (hasSuccess) {
        return result;
      }

      const title = details ? message : t('sys.api.errorTip');
      const content = details ? details : message;
      if (options.errorMessageMode === 'modal') {
        createErrorModal({ title: title, content: content });
      } else if (options.errorMessageMode === 'message') {
        createMessage.error(content);
      }

      throw new Error(content || t('sys.api.apiRequestFailed'));
    }

    return data;
  },

  // Xử lý config trước khi gửi yêu cầu
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // Thêm tham số timestamp cho yêu cầu GET để tránh lấy dữ liệu từ bộ nhớ đệm.
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // Tương thích với phong cách RESTful
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) ||
          config.data instanceof FormData
        ) {
          config.data = data;
          config.params = params;
        } else if (
          Reflect.has(config, 'headers') &&
          config.headers &&
          config.headers['Content-Type'] !== ContentTypeEnum.FORM_DATA
        ) {
          // Ngăn dữ liệu dạng form-data bị xóa
          // Với yêu cầu không phải GET, nếu không cung cấp data thì coi params như data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // Tương thích với phong cách RESTful
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: Xử lý interceptor yêu cầu
   */
  requestInterceptors: (config, options) => {
    config.headers = config.headers ?? {};
    // Xử lý config trước khi gửi yêu cầu
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    if ((config as Recordable)?.requestOptions?.withAcceptLanguage !== false) {
      const localeStore = useLocaleStoreWithOut();
      config.headers['Accept-Language'] = localeStore.getLocale;
      if (config.headers['Accept-Language'] == 'zh_CN') {
        config.headers['Accept-Language'] = 'zh-Hans';
      }
    }
    return config;
  },

  /**
   * @description: Xử lý interceptor phản hồi
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: Xử lý lỗi phản hồi
   */
  responseInterceptorsCatch: (_, error: any) => {
    // const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.code && ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code)) {
      const { t } = useI18n();
      const timeout = t('sys.api.apiTimeoutMessage');
      createMessage.error(timeout);
      return Promise.reject(timeout);
    }

    const resMessage = checkResponse(error.response);
    return Promise.reject(resMessage ?? error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: 'Bearer',
        timeout: 30 * 1000,
        // Địa chỉ API cơ sở
        // baseURL: globSetting.apiUrl,

        headers: {
          'Content-Type': ContentTypeEnum.JSON,
          // Hủy chuyển hướng cookie từ backend
          'X-Request-From': 'vben',
        },
        // Nếu là định dạng form-data
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // Cách xử lý dữ liệu
        transform,
        xsrfCookieName: 'XSRF-TOKEN',
        // ASP.NET Core
        xsrfHeaderName: 'RequestVerificationToken',
        // Các mục cấu hình, các tùy chọn dưới đây đều có thể bị ghi đè trong từng yêu cầu API riêng lẻ
        requestOptions: {
          // Mặc định thêm prefix vào URL
          joinPrefix: true,
          // Có trả về response header gốc hay không, ví dụ: dùng thuộc tính này khi cần lấy response header
          isReturnNativeResponse: false,
          // Cần xử lý dữ liệu trả về
          isTransformRequestResult: false,
          isTransformResponse: true,
          // Khi gửi yêu cầu POST, thêm tham số vào URL
          joinParamsToUrl: false,
          // Định dạng thời gian của tham số gửi đi
          formatDate: true,
          // Loại thông báo
          errorMessageMode: 'message',
          // Địa chỉ API
          apiUrl: globSetting.apiUrl,
          // Địa chỉ API ghép nối
          urlPrefix: urlPrefix,
          //  Có thêm timestamp hay không
          joinTime: true,
          // Bỏ qua yêu cầu trùng lặp
          ignoreCancelToken: true,
          // Có mang theo token hay không
          withToken: true,
          // Có mang theo tiêu đề Accept-Language hay không
          withAcceptLanguage: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
