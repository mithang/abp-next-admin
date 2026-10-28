import type { Locale } from 'ant-design-vue/es/locale';

import type { App } from 'vue';

import type { LocaleSetupOptions, SupportedLanguagesType } from '@vben/locales';

import { ref } from 'vue';

import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@vben/locales';
import { preferences } from '@vben/preferences';

import { loadComponentMessages } from '@abp/components/locales';
import { useAbpStore } from '@abp/core';
import { useLocalizationsApi } from '@abp/localization';
import { loadPaltformMessages } from '@abp/platform';
import antdEnLocale from 'ant-design-vue/es/locale/en_US';
import antdViLocale from 'ant-design-vue/es/locale/vi_VN';
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

const antdLocale = ref<Locale>(antdDefaultLocale);

const modules = import.meta.glob('./langs/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);
/**
 * Tải gói ngôn ngữ riêng của ứng dụng
 * Ở đây cũng có thể cải tiến để lấy dữ liệu bản dịch từ server
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const [appLocaleMessages, compLocales, platformLocales, _, abpLocales] =
    await Promise.all([
      localesMap[lang]?.(),
      loadComponentMessages(lang),
      loadPaltformMessages(lang),
      loadThirdPartyMessage(lang),
      loadAbpLocale(lang),
    ]);
  return {
    ...appLocaleMessages?.default,
    ...compLocales?.default,
    ...platformLocales?.default,
    ...abpLocales,
  };
}

/**
 * Tải gói ngôn ngữ của thư viện component bên thứ ba
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadAntdLocale(lang), loadDayjsLocale(lang)]);
}

/**
 * Tải gói ngôn ngữ của dayjs
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale;
  switch (lang) {
    case 'en-US': {
      locale = await import('dayjs/locale/en');
      break;
    }
    case 'vi-VN': {
      locale = await import('dayjs/locale/vi');
      break;
    }
    case 'zh-CN': {
      locale = await import('dayjs/locale/zh-cn');
      break;
    }
    // Mặc định dùng tiếng Anh
    default: {
      locale = await import('dayjs/locale/en');
    }
  }
  if (locale) {
    dayjs.extend(localizedFormat);
    dayjs.locale(locale);
    dayjs.extend(localizedFormat);
  } else {
    console.error(`Failed to load dayjs locale for ${lang}`);
  }
}

/**
 * Tải gói ngôn ngữ của antd
 * @param lang
 */
async function loadAntdLocale(lang: SupportedLanguagesType) {
  switch (lang) {
    case 'en-US': {
      antdLocale.value = antdEnLocale;
      break;
    }
    case 'vi-VN': {
      antdLocale.value = antdViLocale;
      break;
    }
    case 'zh-CN': {
      antdLocale.value = antdDefaultLocale;
      break;
    }
  }
}

/**
 * Tải gói ngôn ngữ của abp
 * @param lang
 */
async function loadAbpLocale(lang: SupportedLanguagesType) {
  const abpStore = useAbpStore();
  const { getLocalizationApi } = useLocalizationsApi();
  let localization = abpStore.localization;

  if (lang !== localization?.currentCulture.cultureName) {
    localization = await getLocalizationApi({
      cultureName: lang,
      onlyDynamics: false,
    });
  }
  abpStore.setLocalization(localization);
  const locales = abpStore.getI18nLocales();
  return locales;
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  });
}

export { $t, antdLocale, setupI18n };
