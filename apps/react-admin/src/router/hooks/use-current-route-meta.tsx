import { isEmpty } from "ramda";
import { useEffect, useState } from "react";
import { type Params, useMatches, useOutlet } from "react-router";

import { useFlattenedRoutes } from "./use-flattened-routes";
import { useRouter } from "./use-router";

import type { RouteMeta } from "#/router";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;
/**
 * Trả về thông tin Meta của route hiện tại
 */
export function useCurrentRouteMeta() {
	// const pathname = usePathname();
	const { push } = useRouter();

	// Lấy instance component của route
	const children = useOutlet();

	// Lấy tất cả route khớp
	const matchs = useMatches();

	// Lấy menu route đã làm phẳng
	const flattenedRoutes = useFlattenedRoutes();

	const [currentRouteMeta, setCurrentRouteMeta] = useState<RouteMeta>();

	useEffect(() => {
		// Lấy route khớp hiện tại
		const lastRoute = matchs.at(-1);
		if (!lastRoute) return;

		const { pathname, params } = lastRoute;
		const matchedRouteMeta = flattenedRoutes.find((item) => {
			const replacedKey = replaceDynamicParams(item.key, params);
			return replacedKey === pathname || `${replacedKey}/` === pathname;
		});

		if (matchedRouteMeta) {
			matchedRouteMeta.outlet = children;
			if (!isEmpty(params)) {
				matchedRouteMeta.params = params;
			}
			setCurrentRouteMeta({ ...matchedRouteMeta });
		} else {
			push(HOMEPAGE);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchs]);

	return currentRouteMeta;
}

/**
 * replace `user/:id`  to `/user/1234512345`
 */
export const replaceDynamicParams = (menuKey: string, params: Params<string>) => {
	let replacedPathName = menuKey;

	// Phân tích tên tham số trong đường dẫn route
	const paramNames = menuKey.match(/:\w+/g);

	if (paramNames) {
		for (const paramName of paramNames) {
			// Bỏ dấu hai chấm để lấy tên tham số
			const paramKey = paramName.slice(1);
			if (!params[paramKey]) continue;

			replacedPathName = replacedPathName.replace(paramName, params[paramKey]);
		}
	}

	return replacedPathName;
};
