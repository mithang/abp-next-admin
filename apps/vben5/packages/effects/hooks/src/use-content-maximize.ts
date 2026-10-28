import { updatePreferences, usePreferences } from '@vben/preferences';
/**
 * Tối đa hóa vùng chính
 */
export function useContentMaximize() {
  const { contentIsMaximize } = usePreferences();

  function toggleMaximize() {
    const isMaximize = contentIsMaximize.value;

    updatePreferences({
      header: {
        hidden: !isMaximize,
      },
      sidebar: {
        hidden: !isMaximize,
      },
    });
  }
  return {
    contentIsMaximize,
    toggleMaximize,
  };
}
