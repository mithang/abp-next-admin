/** DTO cho 3 trang lá vòng 9: Loại thực thể (Data Protection), Nhật ký kiểm toán,
 * Nhật ký hệ thống. Đối chiếu backend contracts (không suy đoán):
 * - IEntityTypeInfoAppService chỉ có GetAsync + GetListAsync (CHỈ ĐỌC; nút Sửa
 *   của bảng web là no-op `onEdit` rỗng, nên mobile không có form tạo/sửa).
 * - IAuditLogAppService: GetList/Get/Delete/DeleteMany (không có tạo/sửa).
 * - ILogAppService chỉ có GetAsync(string id) + GetListAsync (CHỈ ĐỌC, không xóa);
 *   id của log là `fields.id`, không phải field top-level.
 * - LogLevel khớp Microsoft.Extensions.Logging: Trace 0, Debug 1, Information 2,
 *   Warning 3, Error 4, Critical 5, None 6 (khớp enum web).
 */

export interface EntityEnumInfoDto {
  id: string;
  displayName: string;
  name: string;
  value: string;
}

export interface EntityPropertyInfoDto {
  id: string;
  displayName: string;
  enums: EntityEnumInfoDto[];
  javaScriptType: string;
  name: string;
  typeFullName: string;
}

export interface EntityTypeInfoDto {
  id: string;
  displayName: string;
  isAuditEnabled: boolean;
  name: string;
  properties: EntityPropertyInfoDto[];
  typeFullName: string;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface GetEntityTypeInfoListInput {
  filter?: string;
  isAuditEnabled?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface AuditLogActionDto {
  id: string;
  serviceName?: string;
  methodName?: string;
  parameters?: string;
  executionTime: string;
  executionDuration?: number;
}

export interface EntityPropertyChangeDto {
  id: string;
  propertyName?: string;
  originalValue?: string;
  newValue?: string;
  propertyTypeFullName?: string;
}

/** ChangeType web: Created 0, Updated 1, Deleted 2. */
export type EntityChangeType = 0 | 1 | 2;

export interface EntityChangeDto {
  id: string;
  changeType: EntityChangeType;
  changeTime?: string;
  entityId?: string;
  entityTypeFullName?: string;
  propertyChanges?: EntityPropertyChangeDto[];
}

export interface AuditLogDto {
  id: string;
  userName?: string;
  tenantName?: string;
  applicationName?: string;
  url?: string;
  httpMethod?: string;
  httpStatusCode?: number;
  executionTime?: string;
  executionDuration?: number;
  clientId?: string;
  clientIpAddress?: string;
  clientName?: string;
  browserInfo?: string;
  correlationId?: string;
  comments?: string;
  exceptions?: string;
  actions?: AuditLogActionDto[];
  entityChanges?: EntityChangeDto[];
}

export interface AuditLogGetListInput {
  userName?: string;
  url?: string;
  httpMethod?: string;
  httpStatusCode?: number;
  applicationName?: string;
  clientId?: string;
  clientIpAddress?: string;
  correlationId?: string;
  hasException?: boolean;
  minExecutionDuration?: number;
  maxExecutionDuration?: number;
  startTime?: string;
  endTime?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export const LogLevel = {
  Trace: 0,
  Debug: 1,
  Information: 2,
  Warning: 3,
  Error: 4,
  Critical: 5,
  None: 6,
} as const;

export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];

export const LOG_LEVEL_NAMES: Record<number, string> = {
  [LogLevel.Trace]: 'Trace',
  [LogLevel.Debug]: 'Debug',
  [LogLevel.Information]: 'Information',
  [LogLevel.Warning]: 'Warning',
  [LogLevel.Error]: 'Error',
  [LogLevel.Critical]: 'Critical',
  [LogLevel.None]: 'None',
};

export function logLevelName(level: number | undefined): string {
  if (level === undefined) return '';
  return LOG_LEVEL_NAMES[level] ?? String(level);
}

export const ENTITY_CHANGE_TYPE_NAMES: Record<number, string> = {
  0: 'Created',
  1: 'Updated',
  2: 'Deleted',
};

export function entityChangeTypeName(changeType: number | undefined): string {
  if (changeType === undefined) return '';
  return ENTITY_CHANGE_TYPE_NAMES[changeType] ?? String(changeType);
}

export interface LogFieldDto {
  id?: string;
  machineName?: string;
  environment?: string;
  application?: string;
  context?: string;
  actionId?: string;
  actionName?: string;
  requestId?: string;
  requestPath?: string;
  connectionId?: string;
  correlationId?: string;
  clientId?: string;
  userId?: string;
  processId?: number;
  threadId?: number;
}

export interface LogExceptionDto {
  depth?: number;
  class?: string;
  message?: string;
  source?: string;
  stackTrace?: string;
  hResult?: number;
  helpUrl?: string;
}

export interface LogDto {
  timeStamp: string;
  level: number;
  message?: string;
  fields: LogFieldDto;
  exceptions?: LogExceptionDto[];
}

export interface LogGetListInput {
  level?: number;
  application?: string;
  machineName?: string;
  environment?: string;
  context?: string;
  requestId?: string;
  requestPath?: string;
  correlationId?: string;
  processId?: number;
  threadId?: number;
  hasException?: boolean;
  startTime?: string;
  endTime?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}
