/**
 * DTO Webhook, đối chiếu backend C#:
 * - modules/webhooks/.../Definitions/Dto/WebhookGroupDefinitionDto.cs,
 *   WebhookDefinitionDto.cs (group + definition keyed by name, ListResult,
 *   không phân trang ABP; static → chỉ đọc như bảng web).
 * - modules/webhooks/.../WebhookSubscriptionDto.cs (Guid id, paged),
 *   WebhookSendRecordDto.cs + WebhookEventRecordDto.cs (Guid id, paged).
 * - modules/webhooks/.../WebhookSubscriptionCreateOrUpdateInput.cs,
 *   WebhookSendRecordGetListInput.cs, DeleteMany/ResendMany inputs.
 * Web types: packages/@abp/webhooks/src/types/{groups,definitions,
 * subscriptions,sendAttempts}.ts (web dùng string cho Guid).
 */

export interface WebhookGroupDefinitionDto {
  name: string;
  displayName: string;
  isStatic: boolean;
  extraProperties?: Record<string, unknown>;
}

export interface WebhookGroupDefinitionCreateDto {
  name: string;
  displayName: string;
  extraProperties?: Record<string, unknown>;
}

/**
 * UpdateDto của C# có ConcurrencyStamp nhưng DTO trả về (GET) không có
 * field này, và modal web cũng không gửi stamp — mobile gửi đúng các
 * field của form, không bịa stamp.
 */
export interface WebhookGroupDefinitionUpdateDto {
  displayName: string;
  extraProperties?: Record<string, unknown>;
}

export interface WebhookGroupDefinitionGetListInput {
  filter?: string;
}

export interface WebhookDefinitionDto {
  groupName: string;
  name: string;
  displayName: string;
  description?: string;
  isEnabled: boolean;
  isStatic: boolean;
  requiredFeatures?: string[];
  extraProperties?: Record<string, unknown>;
}

export interface WebhookDefinitionCreateDto {
  groupName: string;
  name: string;
  displayName: string;
  description?: string;
  isEnabled: boolean;
  requiredFeatures?: string[];
  extraProperties?: Record<string, unknown>;
}

/** Như nhóm: GET DTO không có stamp, modal web không gửi stamp. */
export interface WebhookDefinitionUpdateDto {
  displayName: string;
  description?: string;
  isEnabled: boolean;
  requiredFeatures?: string[];
  extraProperties?: Record<string, unknown>;
}

export interface WebhookDefinitionGetListInput {
  filter?: string;
  groupName?: string;
}

export interface WebhookSubscriptionDto {
  id: string;
  tenantId?: string;
  webhookUri: string;
  secret?: string;
  isActive: boolean;
  description?: string;
  webhooks: string[];
  headers?: Record<string, string>;
  concurrencyStamp: string;
  timeoutDuration?: number;
  creationTime?: string;
  creatorId?: string;
  lastModificationTime?: string;
}

export interface WebhookSubscriptionCreateDto {
  webhookUri: string;
  secret?: string;
  description?: string;
  timeoutDuration?: number;
  isActive: boolean;
  tenantId?: string;
  webhooks: string[];
  headers?: Record<string, string>;
}

export interface WebhookSubscriptionUpdateDto extends WebhookSubscriptionCreateDto {
  concurrencyStamp: string;
}

export interface WebhookSubscriptionGetListInput {
  filter?: string;
  tenantId?: string;
  webhookUri?: string;
  secret?: string;
  isActive?: boolean;
  webhooks?: string;
  beginCreationTime?: string;
  endCreationTime?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface WebhookSubscriptionDeleteManyInput {
  recordIds: string[];
}

export interface WebhookAvailableDto {
  name: string;
  displayName: string;
  description?: string;
}

export interface WebhookAvailableGroupDto {
  name: string;
  displayName: string;
  webhooks: WebhookAvailableDto[];
}

export interface WebhookEventRecordDto {
  id: string;
  tenantId?: string;
  webhookName: string;
  data?: string;
  creationTime: string;
}

export interface WebhookSendRecordDto {
  id: string;
  tenantId?: string;
  webhookEventId: string;
  webhookSubscriptionId: string;
  response?: string;
  /** HttpStatusCode enum số của .NET (vd 200, 404, 500); backend trả số. */
  responseStatusCode?: number;
  creationTime: string;
  lastModificationTime?: string;
  sendExactSameData: boolean;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  webhookEvent: WebhookEventRecordDto;
}

export interface WebhookSendRecordGetListInput {
  filter?: string;
  tenantId?: string;
  state?: boolean;
  webhookEventId?: string;
  subscriptionId?: string;
  responseStatusCode?: number;
  beginCreationTime?: string;
  endCreationTime?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface WebhookSendRecordDeleteManyInput {
  recordIds: string[];
}

export interface WebhookSendRecordResendManyInput {
  recordIds: string[];
}
