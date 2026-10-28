import type {
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  ThemeModeType,
} from '@vben-core/typings';

interface VbenLayoutProps {
  /**
   * Chiều rộng cố định của vùng nội dung
   * @default 'wide'
   */
  contentCompact?: ContentCompactType;
  /**
   * Chiều rộng bố cục cố định
   * @default 1200
   */
  contentCompactWidth?: number;
  /**
   * padding
   * @default 16
   */
  contentPadding?: number;
  /**
   * paddingBottom
   * @default 16
   */
  contentPaddingBottom?: number;
  /**
   * paddingLeft
   * @default 16
   */
  contentPaddingLeft?: number;
  /**
   * paddingRight
   * @default 16
   */
  contentPaddingRight?: number;
  /**
   * paddingTop
   * @default 16
   */
  contentPaddingTop?: number;
  /**
   * Footer có hiển thị hay không
   * @default false
   */
  footerEnable?: boolean;
  /**
   * Footer có cố định hay không
   * @default true
   */
  footerFixed?: boolean;
  /**
   * Chiều cao footer
   * @default 32
   */
  footerHeight?: number;

  /**
   * Chiều cao header
   * @default 48
   */
  headerHeight?: number;
  /**
   * Thanh trên cùng có bị ẩn hay không
   * @default false
   */
  headerHidden?: boolean;
  /**
   * Chế độ hiển thị header
   * @default 'fixed'
   */
  headerMode?: LayoutHeaderModeType;
  /**
   * Chủ đề thanh trên cùng của header
   */
  headerTheme?: ThemeModeType;
  /**
   * Có hiển thị nút chuyển đổi thanh bên của header hay không
   * @default
   */
  headerToggleSidebarButton?: boolean;
  /**
   * Header có hiển thị hay không
   * @default true
   */
  headerVisible?: boolean;
  /**
   * Có hiển thị trên thiết bị di động hay không
   * @default false
   */
  isMobile?: boolean;
  /**
   * Cách bố cục
   * sidebar-nav: bố cục menu bên
   * header-nav: bố cục menu trên cùng
   * mixed-nav: bố cục menu bên & trên cùng
   * sidebar-mixed-nav: bố cục menu hỗn hợp bên
   * full-content: bố cục nội dung toàn màn hình
   * @default sidebar-nav
   */
  layout?: LayoutType;
  /**
   * Trạng thái thu gọn menu bên
   * @default false
   */
  sidebarCollapse?: boolean;
  /**
   * Nút thu gọn menu bên
   * @default true
   */
  sidebarCollapsedButton?: boolean;
  /**
   * Khi menu bên thu gọn, có hiển thị title hay không
   * @default true
   */
  sidebarCollapseShowTitle?: boolean;
  /**
   * Thanh bên có hiển thị hay không
   * @default true
   */
  sidebarEnable?: boolean;
  /**
   * Chiều rộng bổ sung khi menu bên thu gọn
   * @default 48
   */
  sidebarExtraCollapsedWidth?: number;
  /**
   * Nút thu gọn menu bên có cố định hay không
   * @default true
   */
  sidebarFixedButton?: boolean;
  /**
   * Thanh bên có bị ẩn hay không
   * @default false
   */
  sidebarHidden?: boolean;
  /**
   * Chiều rộng thanh bên hỗn hợp
   * @default 80
   */
  sidebarMixedWidth?: number;
  /**
   * Thanh bên
   * @default dark
   */
  sidebarTheme?: ThemeModeType;
  /**
   * Thanh con của thanh bên
   * @default dark
   */
  sidebarThemeSub?: ThemeModeType;
  /**
   * Chiều rộng thanh bên
   * @default 210
   */
  sidebarWidth?: number;
  /**
   *  Chiều rộng thu gọn menu bên
   * @default 48
   */
  sideCollapseWidth?: number;
  /**
   * Tab có hiển thị hay không
   * @default true
   */
  tabbarEnable?: boolean;
  /**
   * Chiều cao tab
   * @default 30
   */
  tabbarHeight?: number;
  /**
   * zIndex
   * @default 100
   */
  zIndex?: number;
}
export type { VbenLayoutProps };
