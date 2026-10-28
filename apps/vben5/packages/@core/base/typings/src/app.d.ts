type LayoutType =
  | 'full-content'
  | 'header-mixed-nav'
  | 'header-nav'
  | 'header-sidebar-nav'
  | 'mixed-nav'
  | 'sidebar-mixed-nav'
  | 'sidebar-nav';

type ThemeModeType = 'auto' | 'dark' | 'light';

/**
 * Vị trí nút tùy chọn
 * fixed Cố định ở phía phải
 * header Thanh trên cùng
 * auto Tự động
 */
type PreferencesButtonPositionType = 'auto' | 'fixed' | 'header';

type BuiltinThemeType =
  | 'custom'
  | 'deep-blue'
  | 'deep-green'
  | 'default'
  | 'gray'
  | 'green'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'red'
  | 'rose'
  | 'sky-blue'
  | 'slate'
  | 'stone'
  | 'violet'
  | 'yellow'
  | 'zinc'
  | (Record<never, never> & string);

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static';
type LayoutHeaderMenuAlignType = 'center' | 'end' | 'start';

/**
 * Chế độ hết hạn đăng nhập
 * modal Chế độ cửa sổ bật lên
 * page Chế độ trang
 */
type LoginExpiredModeType = 'modal' | 'page';

/**
 * Kiểu breadcrumb
 * background Nền
 * normal Mặc định
 */
type BreadcrumbStyleType = 'background' | 'normal';

/**
 * Chế độ quyền
 * backend Chế độ quyền phía máy chủ
 * frontend Chế độ quyền phía máy khách
 * mixed Chế độ quyền kết hợp
 */
type AccessModeType = 'backend' | 'frontend' | 'mixed';

/**
 * Phong cách điều hướng
 * plain Đơn giản
 * rounded Bo tròn
 */
type NavigationStyleType = 'plain' | 'rounded';

/**
 * Phong cách thanh tab
 * brisk Nhẹ nhàng
 * card Thẻ
 * chrome Kiểu Chrome
 * plain Đơn giản
 */
type TabsStyleType = 'brisk' | 'card' | 'chrome' | 'plain';

/**
 * Animation chuyển trang
 */
type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up';

/**
 * Animation chuyển trang
 * panel-center Bố cục căn giữa
 * panel-left Bố cục căn trái
 * panel-right Bố cục căn phải
 */
type AuthPageLayoutType = 'panel-center' | 'panel-left' | 'panel-right';

/**
 * Tùy chọn múi giờ
 */
interface TimezoneOption {
  label: string;
  offset: number;
  timezone: string;
}

export type {
  AccessModeType,
  AuthPageLayoutType,
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageTransitionType,
  PreferencesButtonPositionType,
  TabsStyleType,
  ThemeModeType,
  TimezoneOption,
};
