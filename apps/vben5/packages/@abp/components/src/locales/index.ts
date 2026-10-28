import type { SupportedLanguagesType } from '@vben/locales';

import { loadLocalesMapFromDir } from '@vben/locales';

const modules = import.meta.glob('./langs/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);

/**
 * Tải tài nguyên bản địa hóa của component tùy chỉnh
 * @param lang Ngôn ngữ hiện tại
 * @returns Tập hợp tài nguyên
 */
export async function loadComponentMessages(lang: SupportedLanguagesType) {
  const locales = localesMap[lang]?.();
  return locales;
}
