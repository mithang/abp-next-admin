/** DTO khớp backend: xem apps/vben5/packages/@abp/identity/src/types/security-logs.ts
 * và API web apps/vben5/packages/@abp/identity/src/api/useSecurityLogsApi.ts.
 * Lưu ý: endpoint nhật ký bảo mật nằm dưới /api/auditing/security-log, không phải
 * /api/identity — đừng "sửa" thành identity cho đồng bộ tên nhóm. */
export interface SecurityLogDto {
  id: string;
  action?: string;
  applicationName?: string;
  browserInfo?: string;
  clientId?: string;
  clientIpAddress?: string;
  correlationId?: string;
  creationTime?: string;
  identity?: string;
  tenantName?: string;
  userId?: string;
  userName?: string;
}

export interface GetSecurityLogPagedInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  userName?: string;
  actionName?: string;
  applicationName?: string;
  clientId?: string;
}
