/**
 * DTO quản lý quyền, đối chiếu apps/vben5/packages/@abp/permissions/src/types/.
 * Backend: modules/permissions-management/.../Definitions/*Controller.cs
 * (api/permission-management/definitions và .../definitions/groups).
 * Lưu ý: update KHÔNG nhận name/groupName (key nằm trong path); với định
 * nghĩa tĩnh, web cho sửa nhưng cấm xóa (nút Delete :disabled="isStatic").
 */
export enum MultiTenancySides {
  Tenant = 0x1,
  Host = 0x2,
  Both = 0x3,
}

export interface PermissionGroupDefinitionDto {
  name: string;
  displayName: string;
  isStatic: boolean;
  extraProperties?: Record<string, unknown>;
}

export interface PermissionGroupDefinitionCreateDto {
  name: string;
  displayName: string;
  extraProperties?: Record<string, unknown>;
}

export interface PermissionGroupDefinitionUpdateDto {
  displayName: string;
  extraProperties?: Record<string, unknown>;
}

export interface PermissionGroupDefinitionGetListInput {
  filter?: string;
}

export interface PermissionDefinitionDto {
  name: string;
  groupName: string;
  displayName: string;
  isEnabled: boolean;
  isStatic: boolean;
  multiTenancySide: MultiTenancySides;
  parentName?: string;
  providers: string[];
  stateCheckers: string;
  extraProperties?: Record<string, unknown>;
}

export interface PermissionDefinitionCreateDto {
  name: string;
  groupName: string;
  displayName: string;
  isEnabled: boolean;
  parentName?: string;
  providers: string[];
  stateCheckers: string;
  extraProperties?: Record<string, unknown>;
}

export interface PermissionDefinitionUpdateDto {
  displayName: string;
  isEnabled: boolean;
  parentName?: string;
  providers: string[];
  stateCheckers: string;
  extraProperties?: Record<string, unknown>;
}

export interface PermissionDefinitionGetListInput {
  filter?: string;
  groupName?: string;
}
