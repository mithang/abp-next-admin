import type { App } from 'vue';

import type { LocaleSetupOptions, SupportedLanguagesType } from '@vben/locales';

import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@vben/locales';
import { preferences } from '@vben/preferences';

const modules = import.meta.glob('./langs/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);

/**
 * Tải gói ngôn ngữ riêng của ứng dụng
 * Cũng có thể sửa đổi để lấy dữ liệu dịch từ phía máy chủ
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const appLocaleMessages = await localesMap[lang]?.();
  return appLocaleMessages?.default;
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  });
}

export { $t, setupI18n };
