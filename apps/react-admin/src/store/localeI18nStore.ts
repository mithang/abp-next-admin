import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import en_US from "antd/locale/en_US";
import zh_CN from "antd/locale/zh_CN";
import vi_VN from "antd/locale/vi_VN";
import { LocalEnum } from "#/enum";
import { getLocalizationApi } from "@/api/abp-core";

import type { Locale as AntdLocal } from "antd/es/locale";
import useAbpStore from "./abpCoreStore";
import { mapLocaleToAbpLanguageFormat } from "@/utils";
import type { Dictionary } from "#/abp-core";

type Locale = keyof typeof LocalEnum;
type Language = {
	locale: keyof typeof LocalEnum;
	icon: string;
	label: string;
	antdLocal: AntdLocal;
};

export const LANGUAGE_MAP: Record<Locale, Language> = {
	[LocalEnum.zh_CN]: {
		locale: LocalEnum.zh_CN,
		label: "Chinese",
		icon: "ic-locale_zh_CN",
		antdLocal: zh_CN,
	},
	[LocalEnum.vi_VN]: {
		locale: LocalEnum.vi_VN,
		label: "Vietnamese",
		icon: "ic-locale_vi_VN",
		antdLocal: vi_VN,
	},
	[LocalEnum.en_US]: {
		locale: LocalEnum.en_US,
		label: "English",
		icon: "ic-locale_en_US",
		antdLocal: en_US,
	},
};

type LocaleStore = {
	locale: Locale;
	language: Language;
	localizations: Dictionary<string, Dictionary<string, string>>;

	actions: {
		setLocale: (locale: Locale, i18n: any) => Promise<void>;
	};
};

const useLocaleStore = create<LocaleStore>()(
	persist(
		(set) => ({
			locale: LocalEnum.en_US, // Ngôn ngữ mặc định
			language: LANGUAGE_MAP[LocalEnum.en_US],
			localizations: {},
			actions: {
				setLocale: async (locale: Locale, i18n: any) => {
					let { localization } = useAbpStore.getState();
					const setLocalization = useAbpStore.getState().actions.setLocalization;
					const getI18nLocales = useAbpStore.getState().actions.getI18nLocales;

					const lang = mapLocaleToAbpLanguageFormat(locale);
					if (lang !== localization?.currentCulture.cultureName) {
						localization = await getLocalizationApi({
							cultureName: lang, // chuyển đổi ngôn ngữ của api
							onlyDynamics: false,
						});
					}

					if (localization) {
						setLocalization(localization); // lưu vào
					}
					const locales = getI18nLocales(); // vừa lưu vào, dọn dẹp lại
					i18n.changeLanguage(locale);
					Object.keys(locales).forEach((resource) => {
						const translations = { [resource]: locales[resource] }; // Giữ cấu trúc lồng nhau
						i18n.addResourceBundle(locale, "translation", translations, true, true); // Thêm tài nguyên vào i18n
					});
					// Cập nhật trạng thái Zustand
					set({
						locale,
						language: LANGUAGE_MAP[locale],
						localizations: locales,
					});
				},
			},
		}),
		{
			name: "localeI18nStore",
			storage: createJSONStorage(() => localStorage),
			// Giữ phong cách, nhưng tạm thời không lưu trữ dữ liệu
			partialize: () => ({}),
		},
	),
);

export const useLocale = () => useLocaleStore((state) => state.locale);
export const useLanguage = () => useLocaleStore((state) => state.language);
export const useSetLocale = () => useLocaleStore((state) => state.actions.setLocale);

export default useLocaleStore;
