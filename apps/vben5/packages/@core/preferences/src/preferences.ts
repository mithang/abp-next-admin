import type { DeepPartial } from '@vben-core/typings';

import type { InitialOptions, Preferences } from './types';

import { markRaw, reactive, readonly, watch } from 'vue';

import { StorageManager } from '@vben-core/shared/cache';
import { isMacOs, merge } from '@vben-core/shared/utils';

import {
  breakpointsTailwind,
  useBreakpoints,
  useDebounceFn,
} from '@vueuse/core';

import { defaultPreferences } from './config';
import { updateCSSVariables } from './update-css-variables';

const STORAGE_KEYS = {
  MAIN: 'preferences',
  LOCALE: 'preferences-locale',
  THEME: 'preferences-theme',
} as const;

class PreferenceManager {
  private cache: StorageManager;
  private debouncedSave: (preference: Preferences) => void;
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized = false;
  private state: Preferences;

  constructor() {
    this.cache = new StorageManager();
    this.state = reactive<Preferences>(
      this.loadFromCache() || { ...defaultPreferences },
    );
    this.debouncedSave = useDebounceFn(
      (preference) => this.saveToCache(preference),
      150,
    );
  }

  /**
   * Xoá mọi cài đặt tuỳ chọn đã lưu trong bộ nhớ đệm
   */
  clearCache = () => {
    Object.values(STORAGE_KEYS).forEach((key) => this.cache.removeItem(key));
  };

  /**
   * Lấy cài đặt tuỳ chọn khởi tạo
   */
  getInitialPreferences = () => {
    return this.initialPreferences;
  };

  /**
   * Lấy cài đặt tuỳ chọn hiện tại (chỉ đọc)
   */
  getPreferences = () => {
    return readonly(this.state);
  };

  /**
   * Khởi tạo cài đặt tuỳ chọn
   * @param options - Mục cấu hình khởi tạo
   * @param options.namespace - Không gian tên, dùng để tách biệt cấu hình của các ứng dụng khác nhau
   * @param options.overrides - Cài đặt tuỳ chọn cần ghi đè
   */
  initPreferences = async ({ namespace, overrides }: InitialOptions) => {
    // Ngăn khởi tạo trùng lặp
    if (this.isInitialized) {
      return;
    }

    // Khởi tạo trình quản lý lưu trữ bằng không gian tên
    this.cache = new StorageManager({ prefix: namespace });

    // Gộp cài đặt tuỳ chọn ban đầu
    this.initialPreferences = merge({}, overrides, defaultPreferences);

    // Tải cài đặt tuỳ chọn từ bộ nhớ đệm và gộp với cấu hình ban đầu
    const cachedPreferences = this.loadFromCache() || {};
    const mergedPreference = merge(
      {},
      cachedPreferences,
      this.initialPreferences,
    );

    // Cập nhật cài đặt tuỳ chọn
    this.updatePreferences(mergedPreference);

    // Đặt trình lắng nghe
    this.setupWatcher();

    // Khởi tạo định danh nền tảng
    this.initPlatform();

    this.isInitialized = true;
  };

  /**
   * Đặt lại cài đặt tuỳ chọn về trạng thái ban đầu
   */
  resetPreferences = () => {
    // Đặt lại trạng thái về cài đặt tuỳ chọn ban đầu
    Object.assign(this.state, this.initialPreferences);

    // Lưu cài đặt tuỳ chọn vào bộ nhớ đệm
    this.saveToCache(this.state);

    // Kích hoạt trực tiếp việc cập nhật giao diện
    this.handleUpdates(this.state);
  };

  /**
   * Cập nhật cài đặt tuỳ chọn
   * @param updates - Cài đặt tuỳ chọn cần cập nhật
   */
  updatePreferences = (updates: DeepPartial<Preferences>) => {
    // Gộp sâu nội dung cập nhật với trạng thái hiện tại
    const mergedState = merge({}, updates, markRaw(this.state));
    Object.assign(this.state, mergedState);

    // Thực hiện cập nhật theo giá trị đã cập nhật
    this.handleUpdates(updates);

    // Lưu vào bộ nhớ đệm
    this.debouncedSave(this.state);
  };

  /**
   * Xử lý cập nhật
   * @param updates - Cài đặt tuỳ chọn đã cập nhật
   */
  private handleUpdates(updates: DeepPartial<Preferences>) {
    const { theme, app } = updates;

    if (
      theme &&
      (Object.keys(theme).length > 0 || Reflect.has(theme, 'fontSize'))
    ) {
      updateCSSVariables(this.state);
    }

    if (
      app &&
      (Reflect.has(app, 'colorGrayMode') || Reflect.has(app, 'colorWeakMode'))
    ) {
      this.updateColorMode(this.state);
    }
  }

  /**
   * Khởi tạo định danh nền tảng
   */
  private initPlatform() {
    document.documentElement.dataset.platform = isMacOs() ? 'macOs' : 'window';
  }

  /**
   * Tải cài đặt tuỳ chọn từ bộ nhớ đệm
   * @returns Cài đặt tuỳ chọn trong bộ nhớ đệm, trả về null nếu không tồn tại
   */
  private loadFromCache(): null | Preferences {
    return this.cache.getItem<Preferences>(STORAGE_KEYS.MAIN);
  }

  /**
   * Lưu cài đặt tuỳ chọn vào bộ nhớ đệm
   * @param preference - Cài đặt tuỳ chọn cần lưu
   */
  private saveToCache(preference: Preferences) {
    this.cache.setItem(STORAGE_KEYS.MAIN, preference);
    this.cache.setItem(STORAGE_KEYS.LOCALE, preference.app.locale);
    this.cache.setItem(STORAGE_KEYS.THEME, preference.theme.mode);
  }

  /**
   * Lắng nghe sự thay đổi của trạng thái và cài đặt tuỳ chọn hệ thống
   */
  private setupWatcher() {
    if (this.isInitialized) {
      return;
    }

    // Lắng nghe điểm ngắt (breakpoint) để xác định có phải thiết bị di động hay không
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMobile = breakpoints.smaller('md');

    watch(
      () => isMobile.value,
      (val) => {
        this.updatePreferences({
          app: { isMobile: val },
        });
      },
      { immediate: true },
    );

    // Lắng nghe sự thay đổi cài đặt chủ đề của hệ thống
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        // Chỉ theo chủ đề hệ thống khi ở chế độ tự động
        if (this.state.theme.mode === 'auto') {
          // Áp dụng chủ đề thực tế trước
          this.updatePreferences({
            theme: { mode: isDark ? 'dark' : 'light' },
          });
          // Sau đó khôi phục về chế độ auto để giữ trạng thái theo hệ thống
          this.updatePreferences({
            theme: { mode: 'auto' },
          });
        }
      });
  }

  /**
   * Cập nhật chế độ màu của trang (xám, mù màu)
   * @param preference - Cài đặt tuỳ chọn
   */
  private updateColorMode(preference: Preferences) {
    const { colorGrayMode, colorWeakMode } = preference.app;
    const dom = document.documentElement;

    dom.classList.toggle('invert-mode', colorWeakMode);
    dom.classList.toggle('grayscale-mode', colorGrayMode);
  }
}

const preferencesManager = new PreferenceManager();

export { PreferenceManager, preferencesManager };
