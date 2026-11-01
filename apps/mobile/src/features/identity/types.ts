/** DTO khớp backend ABP: xem apps/vben5/packages/@abp/identity/src/types/users.ts */
export interface IdentityUserDto {
  id: string;
  userName: string;
  name: string;
  surname?: string;
  email: string;
  phoneNumber?: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  roleNames: string[];
  tenantId?: string;
  creationTime?: string;
  concurrencyStamp?: string;
}

export interface GetUserPagedListInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  filter?: string;
}

export function displayName(user: IdentityUserDto): string {
  const full = [user.name, user.surname].filter(Boolean).join(' ').trim();
  return full || user.userName;
}
