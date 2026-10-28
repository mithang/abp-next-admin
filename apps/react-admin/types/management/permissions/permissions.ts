interface PermissionProvider {
	providerKey?: string;
	providerName: string;
}

interface PermissionDto {
	allowedProviders: string[];
	displayName: string;
	grantedProviders: PermissionProvider[];
	isGranted: boolean;
	name: string;
	parentName?: string;
}

interface PermissionGroupDto {
	displayName: string;
	name: string;
	permissions: PermissionDto[];
}

interface PermissionUpdateDto {
	/** Đã được cấp quyền hay chưa */
	isGranted: boolean;
	/** Tên quyền */
	name: string;
}

interface PermissionsUpdateDto {
	permissions: PermissionUpdateDto[];
}

interface PermissionResultDto {
	entityDisplayName: string;
	groups: PermissionGroupDto[];
}

interface PermissionTree {
	/** Nút con */
	children: PermissionTree[];
	/** Đã bị vô hiệu hoá hay chưa */
	disabled: boolean;
	/** Tên hiển thị */
	displayName: string;
	/** Đã được cấp quyền hay chưa */
	isGranted?: boolean;
	isRoot: boolean;
	/** Định danh quyền */
	name: string;
	/** Nút cha */
	parentName?: string;
}

export type {
	PermissionDto,
	PermissionGroupDto,
	PermissionProvider,
	PermissionResultDto,
	PermissionsUpdateDto,
	PermissionTree,
};
