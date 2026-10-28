# Tương tác với phía máy chủ và dữ liệu Mock

::: tip Giải thích

Tài liệu này giới thiệu cách sử dụng dữ liệu Mock trong môi trường phát triển và tương tác với phía máy chủ, các công nghệ liên quan gồm:

- [Nitro](https://nitro.unjs.io/) máy chủ backend nhẹ, có thể triển khai ở bất cứ đâu, dự án dùng làm máy chủ Mock.
- [axios](https://axios-http.com/docs/intro) dùng để gửi yêu cầu HTTP và tương tác với phía máy chủ.

:::

## Tương tác trong môi trường phát triển

Nếu ứng dụng frontend và máy chủ giao diện backend không chạy trên cùng một máy chủ, bạn cần proxy yêu cầu giao diện tới máy chủ giao diện trong môi trường phát triển. Nếu cùng một máy chủ, có thể trực tiếp yêu cầu địa chỉ giao diện cụ thể.

### Cấu hình CORS cho phát triển cục bộ

::: tip Gợi ý

Cấu hình CORS cho phát triển cục bộ đã được dự án cấu hình sẵn, nếu có nhu cầu khác, bạn có thể tự thêm hoặc điều chỉnh cấu hình.

:::

#### Cấu hình địa chỉ giao diện phát triển cục bộ

Trong tệp `.env.development` ở thư mục gốc của dự án, cấu hình địa chỉ giao diện, ở đây cấu hình là `/api`:

```bash
VITE_GLOB_API_URL=/api
```

#### Cấu hình proxy cho máy chủ phát triển

Khi ở môi trường phát triển, nếu cần xử lý CORS, địa chỉ giao diện được cấu hình trong tệp `vite.config.mts` ở thư mục ứng dụng tương ứng:

```ts{8-16}
// apps/web-antd/vite.config.mts
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    vite: {
      server: {
        proxy: {// [!code focus:11]
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // địa chỉ đích của proxy mock
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
```

#### Yêu cầu giao diện

Theo cấu hình trên, chúng ta có thể sử dụng `/api` làm tiền tố yêu cầu giao diện trong dự án frontend, ví dụ:

```ts
import axios from 'axios';

axios.get('/api/user').then((res) => {
  console.log(res);
});
```

Lúc này, yêu cầu sẽ được proxy tới `http://localhost:5320/api/user`.

::: warning Chú ý

Nhìn từ Network trong bảng điều khiển của trình duyệt, yêu cầu là `http://localhost:5555/api/user`, vì cấu hình proxy sẽ không thay đổi url của yêu cầu cục bộ.

:::

### Cấu hình khi không có CORS

Nếu không có vấn đề CORS, có thể trực tiếp bỏ qua cấu hình [Cấu hình proxy máy chủ phát triển](./server.md#cau-hinh-proxy-may-chu-phat-trien), trực tiếp đặt địa chỉ giao diện tại `VITE_GLOB_API_URL`

Trong tệp `.env.development` ở thư mục gốc của dự án, cấu hình địa chỉ giao diện:

```bash
VITE_GLOB_API_URL=https://mock-napi.vben.pro/api
```

## Tương tác trong môi trường production

### Cấu hình địa chỉ giao diện

Trong tệp `.env.production` ở thư mục gốc của dự án, cấu hình địa chỉ giao diện:

```bash
VITE_GLOB_API_URL=https://mock-napi.vben.pro/api
```

::: tip Cách sửa địa chỉ giao diện động khi đóng gói

Các biến bắt đầu bằng `VITE_GLOB_*` trong tệp `.env` sẽ được inject vào tệp `_app.config.js` khi đóng gói. Sau khi sửa địa chỉ giao diện tương ứng trong `dist/_app.config.js` và làm mới trang là được, không cần đóng gói nhiều lần theo từng môi trường khác nhau, một lần đóng gói có thể dùng để triển khai cho nhiều môi trường giao diện khác nhau.

:::

### Xử lý CORS

Nếu môi trường production xuất hiện vấn đề CORS, có thể sử dụng proxy `nginx` cho địa chỉ giao diện hoặc backend bật `cors` để xử lý (có thể tham khảo dịch vụ mock).

## Cấu hình yêu cầu giao diện

Dự án mặc định đã có cấu hình yêu cầu cơ bản được đóng gói dựa trên `axios`, phần lõi do gói `@vben/request` cung cấp. Dự án không đóng gói quá nhiều, chỉ đơn giản đóng gói một số cấu hình thường dùng, nếu có nhu cầu khác, bạn có thể tự thêm hoặc điều chỉnh cấu hình. Đối với các app khác nhau, có thể dùng các thư viện component khác nhau và `store`, vì vậy trong thư mục `src/api/request.ts` ở thư mục ứng dụng có tệp cấu hình yêu cầu tương ứng, như tệp `src/api/request.ts` của dự án `web-antd`, có thể cấu hình theo nhu cầu của mình.

### Cấu hình mở rộng

Ngoài cấu hình Axios cơ bản, còn mở rộng thêm một phần cấu hình.

```ts
type ExtendOptions<T = any> = {
  /**
   * Cách tuần tự hóa tham số. Đã cài đặt sẵn một số kiểu tuần tự hóa cho mảng
   * - brackets: ids[]=1&ids[]=2&ids[]=3
   * - comma: ids=1,2,3
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3
   * - repeat: ids=1&ids=2&ids=3
   * @default 'brackets'
   */
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];
  /**
   * Cách trả về dữ liệu phản hồi.
   * - raw: AxiosResponse gốc, bao gồm headers, status, v.v., không kiểm tra xem yêu cầu có thành công hay không.
   * - body: Trả về phần BODY của dữ liệu phản hồi (chỉ kiểm tra yêu cầu có thành công hay không dựa trên status, bỏ qua việc đánh giá code, trong trường hợp này bên gọi nên kiểm tra yêu cầu có thành công hay không).
   * - data: Giải cấu trúc dữ liệu BODY của phản hồi, chỉ trả về dữ liệu của nút data trong đó (sẽ kiểm tra status và code có phải trạng thái thành công hay không).
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
```

### Ví dụ yêu cầu

#### Yêu cầu GET

```ts
import { requestClient } from '#/api/request';

export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}
```

#### Yêu cầu POST/PUT

```ts
import { requestClient } from '#/api/request';

export async function saveUserApi(user: UserInfo) {
  return requestClient.post<UserInfo>('/user', user);
}

export async function saveUserApi(user: UserInfo) {
  return requestClient.put<UserInfo>('/user', user);
}

export async function saveUserApi(user: UserInfo) {
  const url = user.id ? `/user/${user.id}` : '/user/';
  return requestClient.request<UserInfo>(url, {
    data: user,
    // hoặc PUT
    method: user.id ? 'PUT' : 'POST',
  });
}
```

#### Yêu cầu DELETE

```ts
import { requestClient } from '#/api/request';

export async function deleteUserApi(userId: number) {
  return requestClient.delete<boolean>(`/user/${userId}`);
}
```

### Cấu hình yêu cầu

Tệp `src/api/request.ts` trong ứng dụng có thể cấu hình theo nhu cầu tình hình của ứng dụng của mình:

```ts
/**
 * Tệp này có thể tự điều chỉnh theo logic nghiệp vụ
 */
import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
  });

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
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // Xử lý header yêu cầu
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // Xử lý định dạng dữ liệu phản hồi trả về. Sẽ trả về dữ liệu tương ứng theo kiểu do responseReturn chỉ định
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      // Chỉ định tên trường code trong dữ liệu do giao diện trả về
      codeField: 'code',
      // Chỉ định tên trường chứa dữ liệu chính trong dữ liệu do giao diện trả về
      dataField: 'data',
      // Giá trị code khi yêu cầu thành công, nếu code do giao diện trả về bằng successCode thì sẽ được coi là yêu cầu thành công
      successCode: 0,
    }),
  );

  // Xử lý khi token hết hạn
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // Xử lý lỗi chung, nếu không vào logic xử lý lỗi ở trên thì sẽ vào đây
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // Ở đây có thể tùy chỉnh theo nghiệp vụ, bạn có thể lấy thông tin trong error để tùy chỉnh xử lý, đưa ra gợi ý khác nhau theo code khác nhau, thay vì trực tiếp dùng message.error để gợi ý msg
      // Trường lỗi do giao diện mock hiện tại trả về là error hoặc message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      // Nếu không có thông tin lỗi, sẽ gợi ý theo mã trạng thái
      message.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
```

### Nhiều địa chỉ giao diện

Chỉ cần tạo nhiều `requestClient` là được, ví dụ:

```ts
const { apiURL, otherApiURL } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

export const requestClient = createRequestClient(apiURL);

export const otherRequestClient = createRequestClient(otherApiURL);
```

## Làm mới Token

Dự án mặc định đã cung cấp logic làm mới Token, chỉ cần cấu hình theo bên dưới là có thể bật:

- Đảm bảo hiện tại đã bật cấu hình làm mới Token

Điều chỉnh `preferences.ts` ở thư mục ứng dụng tương ứng, đảm bảo `enableRefreshToken='true'`.

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    enableRefreshToken: true,
  },
});
```

Trong `src/api/request.ts`, cấu hình phương thức `doRefreshToken` là được:

```ts
// Ở đây điều chỉnh thành định dạng token của bạn
function formatToken(token: null | string) {
  return token ? `Bearer ${token}` : null;
}

/**
 * Logic làm mới token
 */
async function doRefreshToken() {
  const accessStore = useAccessStore();
  // Ở đây điều chỉnh thành giao diện làm mới token của bạn
  const resp = await refreshTokenApi();
  const newToken = resp.data;
  accessStore.setAccessToken(newToken);
  return newToken;
}
```

## Dữ liệu Mock

::: tip Mock trong môi trường production

Phiên bản mới không còn hỗ trợ mock trong môi trường production, hãy sử dụng giao diện thật.

:::

Dữ liệu Mock là một khâu không thể thiếu trong quá trình phát triển frontend, là liên kết then chốt để tách biệt phát triển frontend và backend. Thông qua việc thỏa thuận trước với máy chủ về giao diện, mô phỏng dữ liệu yêu cầu thậm chí cả logic, có thể giúp frontend phát triển độc lập, không bị tiến trình phát triển của máy chủ chặn lại.

Dự án sử dụng [Nitro](https://nitro.unjs.io/) để xử lý dữ liệu mock cục bộ. Nguyên lý của nó là khởi động thêm một dịch vụ backend ở cục bộ, là một dịch vụ backend thật, có thể xử lý yêu cầu, trả về dữ liệu.

### Sử dụng Nitro

Mã dịch vụ Mock nằm trong thư mục `apps/backend-mock`, không cần khởi động thủ công, đã được tích hợp trong dự án, chỉ cần chạy `pnpm dev` ở thư mục gốc của dự án là được, sau khi chạy thành công, bảng điều khiển sẽ in `http://localhost:5320/api`, truy cập địa chỉ này là có thể xem dịch vụ mock.

[Nitro](https://nitro.unjs.io/) cú pháp đơn giản, có thể cấu hình và phát triển theo nhu cầu của mình, cấu hình cụ thể có thể xem [tài liệu Nitro](https://nitro.unjs.io/).

## Tắt dịch vụ Mock

Bản chất của mock là một dịch vụ backend thật, nếu không cần dịch vụ mock, có thể cấu hình `VITE_NITRO_MOCK=false` trong tệp `.env.development` ở thư mục gốc của dự án là có thể tắt dịch vụ mock.

```bash
# .env.development
VITE_NITRO_MOCK=false
```
