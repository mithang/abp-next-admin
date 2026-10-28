import type { ApplicationConfigurationDto, ApplicationLocalizationDto } from "#/abp-core";
import { StorageEnum } from "#/enum";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AbpStore = {
	tenantId: string | undefined;
	xsrfToken: string | undefined;
	application: ApplicationConfigurationDto | undefined;
	localization: ApplicationLocalizationDto | undefined;
	actions: {
		setTenantId: (val?: string) => void;
		getI18nLocales: () => Record<string, any>;
		setApplication: (val: ApplicationConfigurationDto) => void;
		setLocalization: (val: ApplicationLocalizationDto) => void;
		reset: () => void;
	};
};

const useAbpStore = create<AbpStore>()(
	persist(
		(set, get) => ({
			tenantId: undefined,
			xsrfToken: undefined,
			application: undefined,
			localization: undefined,
			actions: {
				// Lấy văn bản bản địa hoá theo định dạng i18n
				getI18nLocales: () => {
					const localization = get().localization;
					const abpLocales: Record<string, any> = {};
					if (!localization) {
						return abpLocales;
					}
					const resources = localization.resources;
					Object.keys(resources).forEach((resource) => {
						const resourceLocales: Record<string, any> = {};
						const resourcesByName = resources[resource];
						if (resourcesByName) {
							Object.keys(resourcesByName.texts).forEach((key) => {
								// let localeKey = key.replaceAll(".", "_");
								// // Dọn dẹp hậu tố/tiền tố _ thừa
								// if (localeKey.endsWith("_")) {
								// 	localeKey = localeKey.slice(0, Math.max(0, localeKey.length - 1));
								// }
								// if (localeKey.startsWith("_")) {
								// 	localeKey = localeKey.slice(1);
								// }
								//(25-02-16) Không cần chuyển key thêm "AbpIdentity.Users.UserName" -> "AbpIdentity_Users_UserName"

								resourceLocales[key] = resourcesByName.texts[key];
							});
							abpLocales[resource] = resourceLocales;
						}
					});
					return abpLocales;
				},
				setTenantId: (val) => set({ tenantId: val }),
				// Thiết lập dữ liệu application
				setApplication: (val) => {
					set({ application: val });
					const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
					const xsrfToken = match ? match[2] : undefined;
					set({ xsrfToken });
					// console.log("--------- xsrfToken set in store:", get().xsrfToken);
					// Trích xuất và thiết lập xsrfToken
				},
				// Thiết lập dữ liệu localization
				setLocalization: (val) => set({ localization: val }),
				// Đặt lại store
				reset: () => set({ application: undefined, localization: undefined }),
			},
		}),
		{
			name: "abpStore", // localStorage key
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				[StorageEnum.Application]: state.application,
			}),
		},
	),
);

// Hàm hook của Store
export const useApplication = () => useAbpStore((state) => state.application);
// export const useLocalization = () => useAbpStore((state) => state.localization);
export const useAbpActions = () => useAbpStore((state) => state.actions);

export default useAbpStore;
