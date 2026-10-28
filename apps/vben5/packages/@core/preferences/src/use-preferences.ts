import { computed } from 'vue';

import { diff } from '@vben-core/shared/utils';

import { preferencesManager } from './preferences';
import { isDarkTheme } from './update-css-variables';

function usePreferences() {
  const preferences = preferencesManager.getPreferences();
  const initialPreferences = preferencesManager.getInitialPreferences();
  /**
   * @zh_CN Tính toán sự thay đổi của tùy chọn
   */
  const diffPreference = computed(() => {
    return diff(initialPreferences, preferences);
  });

  const appPreferences = computed(() => preferences.app);

  const shortcutKeysPreferences = computed(() => preferences.shortcutKeys);

  /**
   * @zh_CN Xác định có phải chế độ tối hay không
   * @param  preferences - Đối tượng tùy chọn hiện tại, giá trị theme của nó sẽ được dùng để xác định có phải chế độ tối hay không.
   * @returns Nếu theme là chế độ tối, trả về true, ngược lại trả về false.
   */
  const isDark = computed(() => {
    return isDarkTheme(preferences.theme.mode);
  });

  const locale = computed(() => {
    return preferences.app.locale;
  });

  const isMobile = computed(() => {
    return appPreferences.value.isMobile;
  });

  const theme = computed(() => {
    return isDark.value ? 'dark' : 'light';
  });

  /**
   * @zh_CN Kiểu bố cục
   */
  const layout = computed(() =>
    isMobile.value ? 'sidebar-nav' : appPreferences.value.layout,
  );

  /**
   * @zh_CN Có hiển thị thanh trên cùng hay không
   */
  const isShowHeaderNav = computed(() => {
    return preferences.header.enable;
  });

  /**
   * @zh_CN Có hiển thị content toàn màn hình hay không, không cần vùng thanh bên, thanh dưới, thanh trên, tab
   */
  const isFullContent = computed(
    () => appPreferences.value.layout === 'full-content',
  );

  /**
   * @zh_CN Có phải chế độ điều hướng thanh bên hay không
   */
  const isSideNav = computed(
    () => appPreferences.value.layout === 'sidebar-nav',
  );

  /**
   * @zh_CN Có phải chế độ hỗn hợp thanh bên hay không
   */
  const isSideMixedNav = computed(
    () => appPreferences.value.layout === 'sidebar-mixed-nav',
  );

  /**
   * @zh_CN Có phải chế độ điều hướng phần đầu hay không
   */
  const isHeaderNav = computed(
    () => appPreferences.value.layout === 'header-nav',
  );

  /**
   * @zh_CN Có phải chế độ hỗn hợp phần đầu hay không
   */
  const isHeaderMixedNav = computed(
    () => appPreferences.value.layout === 'header-mixed-nav',
  );

  /**
   * @zh_CN Có phải chế độ thanh trên toàn chiều rộng + điều hướng thanh bên hay không
   */
  const isHeaderSidebarNav = computed(
    () => appPreferences.value.layout === 'header-sidebar-nav',
  );

  /**
   * @zh_CN Có phải chế độ điều hướng hỗn hợp hay không
   */
  const isMixedNav = computed(
    () => appPreferences.value.layout === 'mixed-nav',
  );

  /**
   * @zh_CN Có chứa chế độ điều hướng thanh bên hay không
   */
  const isSideMode = computed(() => {
    return (
      isMixedNav.value ||
      isSideMixedNav.value ||
      isSideNav.value ||
      isHeaderMixedNav.value ||
      isHeaderSidebarNav.value
    );
  });

  const sidebarCollapsed = computed(() => {
    return preferences.sidebar.collapsed;
  });

  /**
   * @zh_CN Có bật keep-alive hay không
   * Chỉ bật khi tabs hiển thị và keep-alive đã bật
   */
  const keepAlive = computed(
    () => preferences.tabbar.enable && preferences.tabbar.keepAlive,
  );

  /**
   * @zh_CN Bố cục trang đăng nhập/đăng ký có phải phía trái hay không
   */
  const authPanelLeft = computed(() => {
    return appPreferences.value.authPageLayout === 'panel-left';
  });

  /**
   * @zh_CN Bố cục trang đăng nhập/đăng ký có phải phía phải hay không
   */
  const authPanelRight = computed(() => {
    return appPreferences.value.authPageLayout === 'panel-right';
  });

  /**
   * @zh_CN Bố cục trang đăng nhập/đăng ký có phải ở giữa hay không
   */
  const authPanelCenter = computed(() => {
    return appPreferences.value.authPageLayout === 'panel-center';
  });

  /**
   * @zh_CN Nội dung đã được tối đa hóa hay chưa
   * Loại trừ chế độ full-content
   */
  const contentIsMaximize = computed(() => {
    const headerIsHidden = preferences.header.hidden;
    const sidebarIsHidden = preferences.sidebar.hidden;
    return headerIsHidden && sidebarIsHidden && !isFullContent.value;
  });

  /**
   * @zh_CN Có bật phím tắt tìm kiếm toàn cục hay không
   */
  const globalSearchShortcutKey = computed(() => {
    const { enable, globalSearch } = shortcutKeysPreferences.value;
    return enable && globalSearch;
  });

  /**
   * @zh_CN Có bật phím tắt đăng xuất toàn cục hay không
   */
  const globalLogoutShortcutKey = computed(() => {
    const { enable, globalLogout } = shortcutKeysPreferences.value;
    return enable && globalLogout;
  });

  const globalLockScreenShortcutKey = computed(() => {
    const { enable, globalLockScreen } = shortcutKeysPreferences.value;
    return enable && globalLockScreen;
  });

  /**
   * @zh_CN Vị trí nút tùy chọn
   */
  const preferencesButtonPosition = computed(() => {
    const { enablePreferences, preferencesButtonPosition } = preferences.app;

    // Nếu chưa bật nút tùy chọn
    if (!enablePreferences) {
      return {
        fixed: false,
        header: false,
      };
    }

    const { header, sidebar } = preferences;
    const headerHidden = header.hidden;
    const sidebarHidden = sidebar.hidden;

    const contentIsMaximize = headerHidden && sidebarHidden;

    const isHeaderPosition = preferencesButtonPosition === 'header';

    // Nếu đã đặt vị trí cố định
    if (preferencesButtonPosition !== 'auto') {
      return {
        fixed: preferencesButtonPosition === 'fixed',
        header: isHeaderPosition,
      };
    }

    // Nếu là chế độ toàn màn hình hoặc không cố định ở trên cùng,
    const fixed =
      contentIsMaximize ||
      isFullContent.value ||
      isMobile.value ||
      !isShowHeaderNav.value;

    return {
      fixed,
      header: !fixed,
    };
  });

  return {
    authPanelCenter,
    authPanelLeft,
    authPanelRight,
    contentIsMaximize,
    diffPreference,
    globalLockScreenShortcutKey,
    globalLogoutShortcutKey,
    globalSearchShortcutKey,
    isDark,
    isFullContent,
    isHeaderMixedNav,
    isHeaderNav,
    isHeaderSidebarNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    isSideMode,
    isSideNav,
    keepAlive,
    layout,
    locale,
    preferencesButtonPosition,
    sidebarCollapsed,
    theme,
  };
}

export { usePreferences };
