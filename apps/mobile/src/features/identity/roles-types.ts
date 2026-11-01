/** DTO khớp backend ABP: xem apps/vben5/packages/@abp/identity/src/types/roles.ts
 * và API web apps/vben5/packages/@abp/identity/src/api/useRolesApi.ts. */
export interface IdentityRoleDto {
  id: string;
  name: string;
  isDefault: boolean;
  isPublic: boolean;
  isStatic: boolean;
  concurrencyStamp?: string;
}

export interface GetRolePagedListInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  filter?: string;
}

/** Cờ hiển thị của vai trò, dùng để render badge ở list/detail. */
export function roleFlags(role: IdentityRoleDto): ('default' | 'public' | 'static')[] {
  const flags: ('default' | 'public' | 'static')[] = [];
  if (role.isDefault) flags.push('default');
  if (role.isPublic) flags.push('public');
  if (role.isStatic) flags.push('static');
  return flags;
}
