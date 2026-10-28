---
outline: deep
---

# Đăng nhập

Bài viết này giới thiệu cách tùy chỉnh trang đăng nhập của ứng dụng của bạn và cách nhanh chóng tích hợp giao diện trang đăng nhập.

## Điều chỉnh trang đăng nhập

Nếu bạn muốn điều chỉnh tiêu đề, mô tả, biểu tượng và thanh công cụ của trang đăng nhập, bạn có thể thực hiện bằng cách cấu hình tham số của component `AuthPageLayout`.

![login](/guide/login.png)

Chỉ cần trong `src/layouts/auth.vue` của ứng dụng, cấu hình tham số `props` của `AuthPageLayout`:

```vue {2-7}
<AuthPageLayout
  :copyright="true"
  :toolbar="true"
  :toolbarList="['color', 'language', 'layout', 'theme']"
  :app-name="appName"
  :logo="logo"
  :page-description="$t('authentication.pageDesc')"
  :page-title="$t('authentication.pageTitle')"
>
</AuthPageLayout>
```

## Điều chỉnh biểu mẫu đăng nhập

Nếu bạn muốn điều chỉnh nội dung liên quan đến biểu mẫu đăng nhập, bạn có thể cấu hình tham số của component `AuthenticationLogin` trong `src/views/_core/authentication/login.vue` của ứng dụng:

```vue
<AuthenticationLogin
  :loading="authStore.loginLoading"
  @submit="authStore.authLogin"
/>
```

::: details Tham số component AuthenticationLogin

```ts
{
  /**
   * @zh_CN Đường dẫn đăng nhập bằng mã xác minh
   */
  codeLoginPath?: string;
  /**
   * @zh_CN Đường dẫn quên mật khẩu
   */
  forgetPasswordPath?: string;

  /**
   * @zh_CN Có đang ở trạng thái xử lý tải hay không
   */
  loading?: boolean;

  /**
   * @zh_CN Đường dẫn đăng nhập bằng mã QR
   */
  qrCodeLoginPath?: string;

  /**
   * @zh_CN Đường dẫn đăng ký
   */
  registerPath?: string;

  /**
   * @zh_CN Có hiển thị đăng nhập bằng mã xác minh hay không
   */
  showCodeLogin?: boolean;
  /**
   * @zh_CN Có hiển thị quên mật khẩu hay không
   */
  showForgetPassword?: boolean;

  /**
   * @zh_CN Có hiển thị đăng nhập bằng mã QR hay không
   */
  showQrcodeLogin?: boolean;

  /**
   * @zh_CN Có hiển thị nút đăng ký hay không
   */
  showRegister?: boolean;

  /**
   * @zh_CN Có hiển thị ghi nhớ tài khoản hay không
   */
  showRememberMe?: boolean;

  /**
   * @zh_CN Có hiển thị đăng nhập bên thứ ba hay không
   */
  showThirdPartyLogin?: boolean;

  /**
   * @zh_CN Tiêu đề phụ của khung đăng nhập
   */
  subTitle?: string;

  /**
   * @zh_CN Tiêu đề của khung đăng nhập
   */
  title?: string;

}
```

:::

::: tip Note

Nếu các cấu hình này không đáp ứng nhu cầu của bạn, bạn có thể tự triển khai biểu mẫu đăng nhập và logic đăng nhập liên quan hoặc gửi `PR` cho chúng tôi.

:::

## Quy trình tích hợp giao diện

Tại đây sẽ giới thiệu nhanh cách tích hợp backend của riêng bạn.

### Điều kiện tiên quyết

- Trước hết, dịch vụ backend dùng trong tài liệu có định dạng trả về thống nhất như sau:

```ts
interface HttpResponse<T = any> {
  /**
   * 0 biểu thị thành công, các giá trị khác biểu thị thất bại
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}
```

Nếu bạn không tuân theo định dạng này, bạn cần đọc tài liệu [Tương tác phía máy chủ](../essentials/server.md) trước và sửa cấu hình `request.ts` của bạn.

- Tiếp theo, bạn cần đổi địa chỉ proxy cục bộ thành địa chỉ backend thực của bạn, bạn có thể cấu hình trong `vite.config.mts` của ứng dụng:

```ts
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // Tại đây đổi thành địa chỉ giao diện thực của bạn
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
```

### Giao diện đăng nhập

Để đăng nhập bình thường, backend của bạn cần cung cấp tối thiểu `2-3` giao diện:

- Giao diện đăng nhập

Địa chỉ giao diện có thể sửa trong `src/api/core/auth` của ứng dụng, dưới đây là địa chỉ giao diện mặc định:

```ts
/**
 * Đăng nhập
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/** Chỉ cần đảm bảo giá trị trả về của giao diện đăng nhập có trường `accessToken` */
export interface LoginResult {
  accessToken: string;
}
```

- Giao diện lấy thông tin người dùng

Địa chỉ giao diện có thể sửa trong `src/api/core/user` của ứng dụng, dưới đây là địa chỉ giao diện mặc định:

```ts
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

/** Chỉ cần đảm bảo giá trị trả về của giao diện đăng nhập có các trường sau, các trường thừa có thể tự sử dụng */
export interface UserInfo {
  roles: string[];
  realName: string;
}
```

- Lấy mã quyền (tùy chọn)

Giao diện này dùng để lấy mã quyền của người dùng, mã quyền dùng để kiểm soát quyền của người dùng, địa chỉ giao diện có thể sửa trong `src/api/core/auth` của ứng dụng, dưới đây là địa chỉ giao diện mặc định:

```ts
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
```

Nếu bạn không cần quyền này, bạn chỉ cần đổi mã thành trả về một mảng rỗng.

```ts {2}
export async function getAccessCodesApi() {
  // Tại đây chỉ cần trả về một mảng rỗng
  return [];
}
```
