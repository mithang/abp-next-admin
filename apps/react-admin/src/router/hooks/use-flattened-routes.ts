import { useCallback, useMemo } from "react";

import { flattenMenuRoutes, menuFilter } from "../utils";

import { usePermissionRoutes } from "./use-permission-routes";

/**
 * Trả về route menu sau khi làm phẳng
 */
export function useFlattenedRoutes() {
	const flattenRoutes = useCallback(flattenMenuRoutes, []);
	const permissionRoutes = usePermissionRoutes();
	return useMemo(() => {
		const menuRoutes = menuFilter(permissionRoutes);
		return flattenRoutes(menuRoutes);
	}, [flattenRoutes, permissionRoutes]);
}
