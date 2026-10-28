import type {
  AccessModeType,
  AuthPageLayoutType,
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  DeepPartial,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageTransitionType,
  PreferencesButtonPositionType,
  TabsStyleType,
  ThemeModeType,
} from '@vben-core/typings';

type SupportedLanguagesType = 'en-US' | 'vi-VN' | 'zh-CN';

interface AppPreferences {
  /** Chế độ quyền truy cập */
  accessMode: AccessModeType;
  /** Bố cục trang đăng nhập/đăng ký */
  authPageLayout: AuthPageLayoutType;
  /** Thời gian thăm dò kiểm tra cập nhật */
  checkUpdatesInterval: number;
  /** Có bật chế độ xám hay không */
  colorGrayMode: boolean;
  /** Có bật chế độ mù màu hay không */
  colorWeakMode: boolean;
  /** Có bật chế độ thu gọn hay không */
  compact: boolean;
  /** Có bật chế độ thu gọn nội dung hay không */
  contentCompact: ContentCompactType;
  /** Chiều rộng thu gọn nội dung */
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
  /** Có hiển thị nút sao chép tùy chọn hay không */
  enableCopyPreferences: boolean;
  /** Có hiển thị tùy chọn hay không */
  enablePreferences: boolean;
  /**
   * @zh_CN Có bật refreshToken hay không
   */
  enableRefreshToken: boolean;
  /**
   * @zh_CN Có bật hiệu ứng cố định thanh điều hướng tùy chọn hay không
   */
  enableStickyPreferencesNavigationBar: boolean;
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
  /** Vị trí nút tùy chọn */
  preferencesButtonPosition: PreferencesButtonPositionType;
  /**
   * @zh_CN Có bật watermark hay không
   */
  watermark: boolean;
  /**
   * @zh_CN Nội dung watermark
   */
  watermarkContent: string;
  /** z-index */
  zIndex: number;
}

interface BreadcrumbPreferences {
  /** Breadcrumb có được bật hay không */
  enable: boolean;
  /** Breadcrumb có ẩn khi chỉ có một hay không */
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
  /** Bảng cài đặt có hiển thị hay không */
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
  /** Thanh trên có ẩn hay không, ẩn bằng css */
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
  /** Địa chỉ logo cho chủ đề tối (tùy chọn, nếu không đặt sẽ dùng source) */
  sourceDark?: string;
}

interface NavigationPreferences {
  /** Chế độ accordion của menu điều hướng */
  accordion: boolean;
  /** Menu điều hướng có tách ra hay không, chỉ có hiệu lực khi layout=mixed-nav */
  split: boolean;
  /** Kiểu menu điều hướng */
  styleType: NavigationStyleType;
}

interface SidebarPreferences {
  /** Tự động kích hoạt menu con khi nhấp vào danh mục   */
  autoActivateChild: boolean;
  /** Thanh bên có thu gọn hay không */
  collapsed: boolean;
  /** Nút thu gọn thanh bên có hiển thị hay không */
  collapsedButton: boolean;
  /** Khi thanh bên thu gọn, có hiển thị title hay không */
  collapsedShowTitle: boolean;
  /** Chiều rộng khi thanh bên thu gọn */
  collapseWidth: number;
  /** Kéo thả menu thanh bên */
  draggable: boolean;
  /** Thanh bên có hiển thị hay không */
  enable: boolean;
  /** Menu tự động mở rộng khi di chuột qua */
  expandOnHover: boolean;
  /** Vùng mở rộng của thanh bên có thu gọn hay không */
  extraCollapse: boolean;
  /** Chiều rộng thu gọn của vùng mở rộng thanh bên */
  extraCollapsedWidth: number;
  /** Nút cố định thanh bên có hiển thị hay không */
  fixedButton: boolean;
  /** Thanh bên có ẩn hay không - css */
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
  /** Có bật phím tắt tùy chọn toàn cục hay không */
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
  /** Bật chức năng cache tab */
  keepAlive: boolean;
  /** Giới hạn số lượng tối đa */
  maxCount: number;
  /** Có đóng tab khi nhấp chuột giữa hay không */
  middleClickToClose: boolean;
  /** Có lưu trữ tab bền vững hay không */
  persist: boolean;
  /** Có bật biểu tượng nhiều tab hay không */
  showIcon: boolean;
  /** Hiển thị nút tối đa hóa */
  showMaximize: boolean;
  /** Hiển thị nút xem thêm */
  showMore: boolean;
  /** Hiển thị nút làm mới */
  showRefresh: boolean;
  /** Kiểu tab */
  styleType: TabsStyleType;
  /** Có bật lịch sử truy cập hay không */
  visitHistory: boolean;
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
  /** Cỡ chữ (đơn vị: px) */
  fontSize: number;
  /** Chủ đề hiện tại */
  mode: ThemeModeType;
  /** Bo góc */
  radius: string;
  /** Có bật header nửa tối hay không (chỉ có hiệu lực khi theme='light') */
  semiDarkHeader: boolean;
  /** Có bật menu nửa tối hay không (chỉ có hiệu lực khi theme='light') */
  semiDarkSidebar: boolean;
  /** Có bật menu con nửa tối hay không (chỉ có hiệu lực khi theme='light') */
  semiDarkSidebarSub: boolean;
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
  /** Có bật tiện ích chuyển đổi ngôn ngữ hay không */
  languageToggle: boolean;
  /** Có bật chức năng khóa màn hình hay không */
  lockScreen: boolean;
  /** Có hiển thị tiện ích thông báo hay không */
  notification: boolean;
  /** Hiển thị nút làm mới */
  refresh: boolean;
  /** Có hiển thị tiện ích hiện/ẩn thanh bên hay không */
  sidebarToggle: boolean;
  /** Có hiển thị tiện ích chuyển đổi chủ đề hay không */
  themeToggle: boolean;
  /** Có hiển thị tiện ích múi giờ hay không */
  timezone: boolean;
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

type PreferencesKeys = keyof Preferences;

interface InitialOptions {
  namespace: string;
  overrides?: DeepPartial<Preferences>;
}
export type {
  AppPreferences,
  BreadcrumbPreferences,
  FooterPreferences,
  HeaderPreferences,
  InitialOptions,
  LogoPreferences,
  NavigationPreferences,
  Preferences,
  PreferencesKeys,
  ShortcutKeyPreferences,
  SidebarPreferences,
  SupportedLanguagesType,
  TabbarPreferences,
  ThemePreferences,
  TransitionPreferences,
  WidgetPreferences,
};
