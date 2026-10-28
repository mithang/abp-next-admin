# Login

This document explains how to customize the login page of your application.

## Login Page Adjustment

If you want to adjust the title, description, icon, and toolbar of the login page, you can do so by configuring the `props` parameter of the `AuthPageLayout` component.

![login](/guide/login.png)

You just need to configure the `props` parameter of `AuthPageLayout` in `src/router/routes/core.ts` within your application:

```ts {4-8}
 {
    component: AuthPageLayout,
    props: {
      sloganImage: "xxx/xxx.png",
      pageTitle: "Hệ thống quản trị backend lớn dùng ngay không cần cấu hình",
      pageDescription: "Mẫu frontend kỹ thuật hóa, hiệu năng cao, đa thư viện component",
      toolbar: true,
      toolbarList: ['color', 'language', 'layout', 'theme'],
    }
    // ...
  },
```

::: tip

If these configurations do not meet your needs, you can implement your own login page. Simply implement your own `AuthPageLayout`.

:::

## Login Form Adjustment

If you want to adjust the content of the login form, you can configure the `AuthenticationLogin` component parameters in `src/views/_core/authentication/login.vue` within your application:

```vue
<AuthenticationLogin
  :loading="authStore.loginLoading"
  @submit="authStore.authLogin"
/>
```

::: details AuthenticationLogin Component Props

```ts
{
  /**
   * @en Verification code login path
   */
  codeLoginPath?: string;
  /**
   * @en Forget password path
   */
  forgetPasswordPath?: string;

  /**
   * @en Whether it is in loading state
   */
  loading?: boolean;

  /**
   * @en QR code login path
   */
  qrCodeLoginPath?: string;

  /**
   * @en Registration path
   */
  registerPath?: string;

  /**
   * @en Whether to show verification code login
   */
  showCodeLogin?: boolean;
  /**
   * @en Whether to show forget password
   */
  showForgetPassword?: boolean;

  /**
   * @en Whether to show QR code login
   */
  showQrcodeLogin?: boolean;

  /**
   * @en Whether to show registration button
   */
  showRegister?: boolean;

  /**
   * @en Whether to show remember account
   */
  showRememberMe?: boolean;

  /**
   * @en Whether to show third-party login
   */
  showThirdPartyLogin?: boolean;

  /**
   * @en Login box subtitle
   */
  subTitle?: string;

  /**
   * @en Login box title
   */
  title?: string;
}
```

:::

::: tip

If these configurations do not meet your needs, you can implement your own login form and related login logic.

:::
