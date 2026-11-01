/** DTO khớp backend: xem apps/vben5/packages/@abp/identity/src/types/sessions.ts
 * và API web apps/vben5/packages/@abp/identity/src/api/useUserSessionsApi.ts.
 * Thu hồi dùng sessionId (không phải id entity): DELETE /api/identity/sessions/{sessionId}/revoke. */
export interface IdentitySessionDto {
  id: string;
  sessionId: string;
  userId: string;
  device: string;
  deviceInfo: string;
  clientId?: string;
  ipAddresses?: string;
  signedIn: string;
  lastAccessed?: string;
}

export interface GetUserSessionsInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  userId?: string;
  device?: string;
  clientId?: string;
}
