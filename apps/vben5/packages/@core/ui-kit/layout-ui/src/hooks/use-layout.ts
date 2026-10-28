import type { LayoutType } from '@vben-core/typings';

import type { VbenLayoutProps } from '../vben-layout';

import { computed } from 'vue';

export function useLayout(props: VbenLayoutProps) {
  const currentLayout = computed(() =>
    props.isMobile ? 'sidebar-nav' : (props.layout as LayoutType),
  );

  /**
   * Có hiển thị content toàn màn hình hay không, không cần vùng sidebar, bottom, top, tab
   */
  const isFullContent = computed(() => currentLayout.value === 'full-content');

  /**
   * Có phải chế độ hỗn hợp sidebar hay không
   */
  const isSidebarMixedNav = computed(
    () => currentLayout.value === 'sidebar-mixed-nav',
  );

  /**
   * Có phải chế độ điều hướng header hay không
   */
  const isHeaderNav = computed(() => currentLayout.value === 'header-nav');

  /**
   * Có phải chế độ điều hướng hỗn hợp hay không
   */
  const isMixedNav = computed(
    () =>
      currentLayout.value === 'mixed-nav' ||
      currentLayout.value === 'header-sidebar-nav',
  );

  /**
   * Có phải chế độ hỗn hợp header hay không
   */
  const isHeaderMixedNav = computed(
    () => currentLayout.value === 'header-mixed-nav',
  );

  return {
    currentLayout,
    isFullContent,
    isHeaderMixedNav,
    isHeaderNav,
    isMixedNav,
    isSidebarMixedNav,
  };
}
