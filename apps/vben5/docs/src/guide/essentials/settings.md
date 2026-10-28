# Cấu hình

## Cấu hình biến môi trường

Cấu hình biến môi trường của dự án nằm trong thư mục ứng dụng, gồm `.env`, `.env.development`, `.env.production`.

Quy tắc giống với [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html). Định dạng như sau:

```bash
.env                # Được nạp trong mọi môi trường
.env.local          # Được nạp trong mọi môi trường, nhưng bị git bỏ qua
.env.[mode]         # Chỉ được nạp trong chế độ đã chỉ định
.env.[mode].local   # Chỉ được nạp trong chế độ đã chỉ định, nhưng bị git bỏ qua
```

::: tip

- Chỉ các biến bắt đầu bằng `VITE_` mới được nhúng vào gói phía client, bạn có thể truy cập chúng trong mã dự án như sau:

  ```ts
  console.log(import.meta.env.VITE_PROT);
  ```

- Các biến bắt đầu bằng `VITE_GLOB_*` sẽ được đưa vào tệp cấu hình `_app.config.js` khi đóng gói.

:::

## Giải thích cấu hình môi trường

::: code-group

```bash [.env]
# Tiêu đề ứng dụng
VITE_APP_TITLE=Vben Admin

# Không gian tên ứng dụng, dùng làm tiền tố cho các chức năng như bộ nhớ đệm, store, đảm bảo tách biệt
VITE_APP_NAMESPACE=vben-web-antd
```

```bash [.env.development]
# Số cổng
VITE_PORT=5555

# Đường dẫn công khai của tài nguyên, cần bắt đầu và kết thúc bằng /
VITE_BASE=/

# Địa chỉ API
VITE_GLOB_API_URL=/api

# Có bật dịch vụ Nitro Mock hay không, true là bật, false là tắt
VITE_NITRO_MOCK=true

# Có mở devtools hay không, true là mở, false là đóng
VITE_DEVTOOLS=true

# Có chèn loading toàn cục hay không
VITE_INJECT_APP_LOADING=true

```

```bash [.env.production]
# Đường dẫn công khai của tài nguyên, cần bắt đầu và kết thúc bằng /
VITE_BASE=/

# Địa chỉ API
VITE_GLOB_API_URL=https://mock-napi.vben.pro/api

# Có bật nén hay không, có thể đặt thành none, brotli, gzip
VITE_COMPRESS=gzip

# Có bật PWA hay không
VITE_PWA=false

# Chế độ của vue-router
VITE_ROUTER_HISTORY=hash

# Có chèn loading toàn cục hay không
VITE_INJECT_APP_LOADING=true

# Sau khi đóng gói có tạo dist.zip hay không
VITE_ARCHIVER=true

```

:::

## Cấu hình động cho môi trường production

Khi thực thi `pnpm build` tại thư mục gốc của monorepo để build dự án, tệp `dist/_app.config.js` sẽ tự động được tạo trong ứng dụng tương ứng và chèn vào `index.html`.

`_app.config.js` là tệp cấu hình động, có thể sửa đổi cấu hình động theo từng môi trường sau khi dự án được build. Nội dung như sau:

```ts
window._VBEN_ADMIN_PRO_APP_CONF_ = {
  VITE_GLOB_API_URL: 'https://mock-napi.vben.pro/api',
};
Object.freeze(window._VBEN_ADMIN_PRO_APP_CONF_);
Object.defineProperty(window, '_VBEN_ADMIN_PRO_APP_CONF_', {
  configurable: false,
  writable: false,
});
```

### Tác dụng

`_app.config.js` phục vụ nhu cầu sửa đổi cấu hình động sau khi dự án đóng gói, ví dụ như địa chỉ API. Không cần đóng gói lại, chỉ cần sửa biến trong /`dist/_app.config.js` sau khi đóng gói rồi làm mới là cập nhật được biến cục bộ trong mã. Dùng tệp `js` ở đây là để đảm bảo thứ tự nạp tệp cấu hình luôn ở phía trước.

### Cách dùng

Để lấy biến trong `_app.config.js`, cần dùng phương thức `useAppConfig` do `@vben/hooks` cung cấp.

```ts
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
```

### Thêm mới

Để thêm một mục cấu hình có thể sửa đổi động, chỉ cần làm theo các bước sau:

- Trước hết, trong `.env` hoặc tệp cấu hình môi trường phát triển tương ứng, thêm biến cần cấu hình động, là biến bắt đầu bằng `VITE_GLOB_*`, ví dụ:

  ```bash
  VITE_GLOB_OTHER_API_URL=https://mock-napi.vben.pro/other-api
  ```

- Trong `packages/types/global.d.ts`, thêm định nghĩa kiểu tương ứng, ví dụ:

  ```ts
  export interface VbenAdminProAppConfigRaw {
    VITE_GLOB_API_URL: string;
    VITE_GLOB_OTHER_API_URL: string; // [!code ++]
  }

  export interface ApplicationConfig {
    apiURL: string;
    otherApiURL: string; // [!code ++]
  }
  ```

- Trong `packages/effects/hooks/src/use-app-config.ts`, thêm mục cấu hình tương ứng, ví dụ:

  ```ts
  export function useAppConfig(
    env: Record<string, any>,
    isProduction: boolean,
  ): ApplicationConfig {
    // Trong môi trường production, dùng trực tiếp biến toàn cục window._VBEN_ADMIN_PRO_APP_CONF_
    const config = isProduction
      ? window._VBEN_ADMIN_PRO_APP_CONF_
      : (env as VbenAdminProAppConfigRaw);

    const { VITE_GLOB_API_URL, VITE_GLOB_OTHER_API_URL } = config; // [!code ++]

    return {
      apiURL: VITE_GLOB_API_URL,
      otherApiURL: VITE_GLOB_OTHER_API_URL, // [!code ++]
    };
  }
  ```

Đến đây, bạn đã có thể dùng phương thức `useAppConfig` trong dự án để lấy mục cấu hình mới thêm.

```ts
const { otherApiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
```

::: warning Lưu ý

Phương thức `useAppConfig` chỉ được dùng trong ứng dụng, đừng gắn chặt vào bên trong gói. Việc truyền `import.meta.env` và `import.meta.env.PROD` ở đây là để tránh trường hợp đó, một gói thuần túy nên tránh dùng biến của công cụ build cụ thể.

:::

## Cài đặt tùy chọn

Dự án cung cấp rất nhiều cài đặt tùy chọn, dùng để cấu hình động các chức năng của dự án:

![](/guide/preferences.png)

Nếu bạn không tìm thấy tài liệu hướng dẫn, có thể thử tự cấu hình xong rồi nhấn `Sao chép cài đặt tùy chọn` để ghi đè mặc định của dự án. Tệp cấu hình nằm trong thư mục ứng dụng tại `preferences.ts`, tại đây bạn có thể ghi đè cấu hình mặc định của framework để tùy chỉnh.

```ts
import { useAppConfig } from '@vben/hooks';
import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description Tệp cấu hình dự án
 * Chỉ cần ghi đè một phần cấu hình trong dự án, cấu hình không cần thì không cần ghi đè, sẽ tự động dùng cấu hình mặc định
 * !!! Sau khi thay đổi cấu hình hãy xóa bộ nhớ đệm, nếu không có thể không có hiệu lực
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
});
```

### Cấu hình mặc định của framework

::: details Xem cấu hình mặc định của framework

```ts
const defaultPreferences: Preferences = {
  app: {
    accessMode: 'frontend',
    authPageLayout: 'panel-right',
    checkUpdatesInterval: 1,
    colorGrayMode: false,
    colorWeakMode: false,
    compact: false,
    contentCompact: 'wide',
    contentCompactWidth: 1200,
    contentPadding: 0,
    contentPaddingBottom: 0,
    contentPaddingLeft: 0,
    contentPaddingRight: 0,
    contentPaddingTop: 0,
    defaultAvatar:
      'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp',
    defaultHomePath: '/analytics',
    dynamicTitle: true,
    enableCheckUpdates: true,
    enablePreferences: true,
    enableCopyPreferences: true,
    enableRefreshToken: false,
    isMobile: false,
    layout: 'sidebar-nav',
    locale: 'zh-CN',
    loginExpiredMode: 'page',
    name: 'Vben Admin',
    preferencesButtonPosition: 'auto',
    watermark: false,
    zIndex: 200,
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: false,
    showIcon: true,
    styleType: 'normal',
  },
  copyright: {
    companyName: 'Vben',
    companySiteLink: 'https://www.vben.pro',
    date: '2024',
    enable: true,
    icp: '',
    icpLink: '',
    settingShow: true,
  },
  footer: {
    enable: false,
    fixed: false,
    height: 32,
  },
  header: {
    enable: true,
    height: 50,
    hidden: false,
    menuAlign: 'start',
    mode: 'fixed',
  },
  logo: {
    enable: true,
    fit: 'contain',
    source: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
    // sourceDark: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-dark.webp', // Tùy chọn: logo chủ đề tối
  },
  navigation: {
    accordion: true,
    split: true,
    styleType: 'rounded',
  },
  shortcutKeys: {
    enable: true,
    globalLockScreen: true,
    globalLogout: true,
    globalPreferences: true,
    globalSearch: true,
  },
  sidebar: {
    autoActivateChild: false,
    collapsed: false,
    collapsedButton: true,
    collapsedShowTitle: false,
    collapseWidth: 60,
    enable: true,
    expandOnHover: true,
    extraCollapse: false,
    extraCollapsedWidth: 60,
    fixedButton: true,
    hidden: false,
    mixedWidth: 80,
    width: 224,
  },
  tabbar: {
    draggable: true,
    enable: true,
    height: 38,
    keepAlive: true,
    maxCount: 0,
    middleClickToClose: false,
    persist: true,
    showIcon: true,
    showMaximize: true,
    showMore: true,
    styleType: 'chrome',
    wheelable: true,
  },
  theme: {
    builtinType: 'default',
    colorDestructive: 'hsl(348 100% 61%)',
    colorPrimary: 'hsl(212 100% 45%)',
    colorSuccess: 'hsl(144 57% 58%)',
    colorWarning: 'hsl(42 84% 61%)',
    mode: 'dark',
    radius: '0.5',
    semiDarkHeader: false,
    semiDarkSidebar: false,
  },
  transition: {
    enable: true,
    loading: true,
    name: 'fade-slide',
    progress: true,
  },
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    lockScreen: true,
    notification: true,
    refresh: true,
    sidebarToggle: true,
    themeToggle: true,
  },
};
```

:::

::: details Xem kiểu cấu hình mặc định của framework

```ts
interface AppPreferences {
  /** Chế độ quyền */
  accessMode: AccessModeType;
  /** Bố cục trang đăng nhập/đăng ký */
  authPageLayout: AuthPageLayoutType;
  /** Thời gian thăm dò kiểm tra cập nhật */
  checkUpdatesInterval: number;
  /** Có bật chế độ xám hay không */
  colorGrayMode: boolean;
  /** Có bật chế độ mù màu hay không */
  colorWeakMode: boolean;
  /** Có bật chế độ gọn hay không */
  compact: boolean;
  /** Có bật chế độ nội dung gọn hay không */
  contentCompact: ContentCompactType;
  /** Chiều rộng nội dung gọn */
  contentCompactWidth: number;
  /** Khoảng đệm trong nội dung */
  contentPadding: number;
  /** Khoảng đệm dưới nội dung */
  contentPaddingBottom: number;
  /** Khoảng đệm trái nội dung */
  contentPaddingLeft: number;
  /** Khoảng đệm phải nội dung */
  contentPaddingRight: number;
  /** Khoảng đệm trên nội dung */
  contentPaddingTop: number;
  // /** Ảnh đại diện mặc định của ứng dụng */
  defaultAvatar: string;
  /** Địa chỉ trang chủ mặc định */
  defaultHomePath: string;
  // /** Bật tiêu đề động */
  dynamicTitle: boolean;
  /** Có bật kiểm tra cập nhật hay không */
  enableCheckUpdates: boolean;
  /** Có hiển thị cài đặt tùy chọn hay không */
  enablePreferences: boolean;
  /** Có hiển thị nút sao chép cài đặt tùy chọn hay không */
  enableCopyPreferences: boolean;
  /**
   * @zh_CN Có bật refreshToken hay không
   */
  enableRefreshToken: boolean;
  /** Có phải thiết bị di động hay không */
  isMobile: boolean;
  /** Kiểu bố cục */
  layout: LayoutType;
  /** Ngôn ngữ được hỗ trợ */
  locale: SupportedLanguagesType;
  /** Chế độ hết hạn đăng nhập */
  loginExpiredMode: LoginExpiredModeType;
  /** Tên ứng dụng */
  name: string;
  /** Vị trí nút cài đặt tùy chọn */
  preferencesButtonPosition: PreferencesButtonPositionType;
  /**
   * @zh_CN Có bật watermark hay không
   */
  watermark: boolean;
  /** z-index */
  zIndex: number;
}

interface BreadcrumbPreferences {
  /** Breadcrumb có được bật hay không */
  enable: boolean;
  /** Breadcrumb có bị ẩn khi chỉ có một hay không */
  hideOnlyOne: boolean;
  /** Biểu tượng trang chủ của breadcrumb có hiển thị hay không */
  showHome: boolean;
  /** Biểu tượng breadcrumb có hiển thị hay không */
  showIcon: boolean;
  /** Kiểu breadcrumb */
  styleType: BreadcrumbStyleType;
}

interface CopyrightPreferences {
  /** Tên công ty bản quyền */
  companyName: string;
  /** Liên kết tên công ty bản quyền */
  companySiteLink: string;
  /** Ngày bản quyền */
  date: string;
  /** Bản quyền có hiển thị hay không */
  enable: boolean;
  /** Số đăng ký ICP */
  icp: string;
  /** Liên kết số đăng ký ICP */
  icpLink: string;
  /** Bảng cài đặt có hiển thị hay không*/
  settingShow?: boolean;
}

interface FooterPreferences {
  /** Thanh dưới có hiển thị hay không */
  enable: boolean;
  /** Thanh dưới có cố định hay không */
  fixed: boolean;
  /** Chiều cao thanh dưới */
  height: number;
}

interface HeaderPreferences {
  /** Thanh trên có được bật hay không */
  enable: boolean;
  /** Chiều cao thanh trên */
  height: number;
  /** Thanh trên có bị ẩn hay không, ẩn bằng css */
  hidden: boolean;
  /** Vị trí menu thanh trên */
  menuAlign: LayoutHeaderMenuAlignType;
  /** Chế độ hiển thị header */
  mode: LayoutHeaderModeType;
}

interface LogoPreferences {
  /** Logo có hiển thị hay không */
  enable: boolean;
  /** Cách logo vừa với khung hình */
  fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /** Địa chỉ logo */
  source: string;
  /** Địa chỉ logo chủ đề tối (tùy chọn, nếu không đặt sẽ dùng source) */
  sourceDark?: string;
}

interface NavigationPreferences {
  /** Chế độ accordion của menu điều hướng */
  accordion: boolean;
  /** Menu điều hướng có tách hay không, chỉ có hiệu lực khi layout=mixed-nav */
  split: boolean;
  /** Kiểu menu điều hướng */
  styleType: NavigationStyleType;
}

interface SidebarPreferences {
  /** Tự động kích hoạt menu con khi nhấn vào thư mục   */
  autoActivateChild: boolean;
  /** Thanh bên có thu gọn hay không */
  collapsed: boolean;
  /** Nút thu gọn thanh bên có hiển thị hay không */
  collapsedButton: boolean;
  /** Khi thanh bên thu gọn, có hiển thị title hay không */
  collapsedShowTitle: boolean;
  /** Chiều rộng khi thanh bên thu gọn */
  collapseWidth: number;
  /** Thanh bên có hiển thị hay không */
  enable: boolean;
  /** Trạng thái tự mở rộng menu */
  expandOnHover: boolean;
  /** Vùng mở rộng của thanh bên có thu gọn hay không */
  extraCollapse: boolean;
  /** Chiều rộng thu gọn của vùng mở rộng thanh bên */
  extraCollapsedWidth: number;
  /** Nút cố định thanh bên có hiển thị hay không */
  fixedButton: boolean;
  /** Thanh bên có bị ẩn hay không - css */
  hidden: boolean;
  /** Chiều rộng thanh bên hỗn hợp */
  mixedWidth: number;
  /** Chiều rộng thanh bên */
  width: number;
}

interface ShortcutKeyPreferences {
  /** Có bật phím tắt - toàn cục hay không */
  enable: boolean;
  /** Có bật phím tắt khóa màn hình toàn cục hay không */
  globalLockScreen: boolean;
  /** Có bật phím tắt đăng xuất toàn cục hay không */
  globalLogout: boolean;
  /** Có bật phím tắt cài đặt tùy chọn toàn cục hay không */
  globalPreferences: boolean;
  /** Có bật phím tắt tìm kiếm toàn cục hay không */
  globalSearch: boolean;
}

interface TabbarPreferences {
  /** Có bật kéo thả nhiều tab hay không */
  draggable: boolean;
  /** Có bật nhiều tab hay không */
  enable: boolean;
  /** Chiều cao tab */
  height: number;
  /** Bật chức năng bộ nhớ đệm tab */
  keepAlive: boolean;
  /** Giới hạn số lượng tối đa */
  maxCount: number;
  /** Có đóng tab khi nhấn nút giữa chuột hay không */
  middleClickToClose: boolean;
  /** Có lưu tab bền vững hay không */
  persist: boolean;
  /** Có bật biểu tượng nhiều tab hay không */
  showIcon: boolean;
  /** Hiển thị nút phóng to */
  showMaximize: boolean;
  /** Hiển thị nút thêm */
  showMore: boolean;
  /** Kiểu tab */
  styleType: TabsStyleType;
  /** Có bật phản hồi con lăn chuột hay không */
  wheelable: boolean;
}

interface ThemePreferences {
  /** Tên chủ đề tích hợp sẵn */
  builtinType: BuiltinThemeType;
  /** Màu lỗi */
  colorDestructive: string;
  /** Màu chủ đề */
  colorPrimary: string;
  /** Màu thành công */
  colorSuccess: string;
  /** Màu cảnh báo */
  colorWarning: string;
  /** Chủ đề hiện tại */
  mode: ThemeModeType;
  /** Bo góc */
  radius: string;
  /** Có bật header nửa tối hay không (chỉ có hiệu lực khi theme='light') */
  semiDarkHeader: boolean;
  /** Có bật menu nửa tối hay không (chỉ có hiệu lực khi theme='light') */
  semiDarkSidebar: boolean;
}

interface TransitionPreferences {
  /** Hiệu ứng chuyển trang có được bật hay không */
  enable: boolean;
  // /** Có bật loading khi tải trang hay không */
  loading: boolean;
  /** Hiệu ứng chuyển trang */
  name: PageTransitionType | string;
  /** Có bật hiệu ứng tiến trình tải trang hay không */
  progress: boolean;
}

interface WidgetPreferences {
  /** Có bật tiện ích toàn màn hình hay không */
  fullscreen: boolean;
  /** Có bật tiện ích tìm kiếm toàn cục hay không */
  globalSearch: boolean;
  /** Có bật tiện ích chuyển ngôn ngữ hay không */
  languageToggle: boolean;
  /** Có bật chức năng khóa màn hình hay không */
  lockScreen: boolean;
  /** Có hiển thị tiện ích thông báo hay không */
  notification: boolean;
  /** Hiển thị nút làm mới */
  refresh: boolean;
  /** Có hiển thị tiện ích hiển thị/ẩn thanh bên hay không */
  sidebarToggle: boolean;
  /** Có hiển thị tiện ích chuyển chủ đề hay không */
  themeToggle: boolean;
}

interface Preferences {
  /** Cấu hình toàn cục */
  app: AppPreferences;
  /** Cấu hình thanh trên */
  breadcrumb: BreadcrumbPreferences;
  /** Cấu hình bản quyền */
  copyright: CopyrightPreferences;
  /** Cấu hình thanh dưới */
  footer: FooterPreferences;
  /** Cấu hình breadcrumb */
  header: HeaderPreferences;
  /** Cấu hình logo */
  logo: LogoPreferences;
  /** Cấu hình điều hướng */
  navigation: NavigationPreferences;
  /** Cấu hình phím tắt */
  shortcutKeys: ShortcutKeyPreferences;
  /** Cấu hình thanh bên */
  sidebar: SidebarPreferences;
  /** Cấu hình tab */
  tabbar: TabbarPreferences;
  /** Cấu hình chủ đề */
  theme: ThemePreferences;
  /** Cấu hình hiệu ứng */
  transition: TransitionPreferences;
  /** Cấu hình chức năng */
  widget: WidgetPreferences;
}
```

:::

::: warning Lưu ý

- Phương thức `overridesPreferences` chỉ cần ghi đè một phần cấu hình trong dự án, cấu hình không cần thì không cần ghi đè, sẽ tự động dùng cấu hình mặc định.
- Bất kỳ mục cấu hình nào cũng có thể ghi đè, chỉ cần ghi đè trong phương thức `overridesPreferences`, đừng sửa tệp cấu hình mặc định.
- Sau khi thay đổi cấu hình hãy xóa bộ nhớ đệm, nếu không có thể không có hiệu lực.

:::
