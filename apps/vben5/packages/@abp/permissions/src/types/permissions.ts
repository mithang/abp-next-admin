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
  /** Có được cấp quyền hay không */
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
  /** Có bị vô hiệu hóa hay không */
  disabled: boolean;
  /** Tên hiển thị */
  displayName: string;
  /** Có được cấp quyền hay không */
  isGranted?: boolean;
  isRoot: boolean;
  /** Định danh quyền */
  key: string;
  /** Định danh quyền */
  name: string;
  /** Nút cha */
  parentName?: string;
}

interface GetPermissionGrantedWithProviderListResultDto {
  grantedProviders: PermissionProvider[];
}

export type {
  GetPermissionGrantedWithProviderListResultDto,
  PermissionDto,
  PermissionGroupDto,
  PermissionProvider,
  PermissionResultDto,
  PermissionsUpdateDto,
  PermissionTree,
};
