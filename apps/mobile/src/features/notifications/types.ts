/** Types nhóm Thông báo — mirror types web @abp/notifications + backend realtime-notifications. */

/** NotificationLifetime web: Persistent 0, OnlyOne 1. */
export enum NotificationLifetime {
  Persistent = 0,
  OnlyOne = 1,
}

/** NotificationType web: Application 0, System 10, User 20, ServiceCallback 30. */
export enum NotificationType {
  Application = 0,
  System = 10,
  User = 20,
  ServiceCallback = 30,
}

/** NotificationContentType web: Text 0, Html 1, Markdown 2, Json 3. */
export enum NotificationContentType {
  Text = 0,
  Html = 1,
  Markdown = 2,
  Json = 3,
}

/** NotificationSeverity web: Success 0, Info 10, Warn 20, Error 30, Fatal 40. */
export enum NotificationSeverity {
  Success = 0,
  Info = 10,
  Warn = 20,
  Error = 30,
  Fatal = 40,
}

/** NotificationReadState web: Read 0, UnRead 1 (ngược trực giác — đọc kỹ khi dùng). */
export enum NotificationReadState {
  Read = 0,
  UnRead = 1,
}

/** NotificationSendState web: None 0, Disabled 1, Sent 2, Failed 3. */
export enum NotificationSendState {
  None = 0,
  Disabled = 1,
  Sent = 2,
  Failed = 3,
}

export interface NotificationData {
  extraProperties: Record<string, unknown>;
  type: string;
}

export interface UserNotificationDto {
  contentType: NotificationContentType;
  creationTime: string;
  data: NotificationData;
  /** Backend là long; web khai string — URL/key dùng qua String(id). */
  id: string;
  lifetime: NotificationLifetime;
  name: string;
  severity: NotificationSeverity;
  state: NotificationReadState;
  type: NotificationType;
}

export interface GetMyNotifilerPagedListInput {
  filter?: string;
  readState?: NotificationReadState;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface MarkReadStateInput {
  idList: string[];
  state: NotificationReadState;
}

export interface NotificationGroupDefinitionDto {
  allowSubscriptionToClients: boolean;
  description?: string;
  displayName: string;
  isStatic: boolean;
  name: string;
}

export interface NotificationGroupDefinitionGetListInput {
  filter?: string;
}

export interface NotificationGroupDefinitionCreateDto {
  name: string;
  displayName: string;
  description?: string;
  allowSubscriptionToClients: boolean;
}

export interface NotificationGroupDefinitionUpdateDto {
  displayName: string;
  description?: string;
  allowSubscriptionToClients: boolean;
}

export interface NotificationDefinitionDto {
  allowSubscriptionToClients: boolean;
  contentType: NotificationContentType;
  description?: string;
  displayName: string;
  groupName: string;
  isStatic: boolean;
  name: string;
  notificationLifetime: NotificationLifetime;
  notificationType: NotificationType;
  providers?: string[];
  template?: string;
}

export interface NotificationDefinitionGetListInput {
  filter?: string;
  groupName?: string;
  allowSubscriptionToClients?: boolean;
  contentType?: NotificationContentType;
  notificationLifetime?: NotificationLifetime;
  notificationType?: NotificationType;
  template?: string;
}

export interface NotificationDefinitionCreateDto {
  name: string;
  groupName?: string;
  displayName: string;
  description?: string;
  allowSubscriptionToClients?: boolean;
  contentType?: NotificationContentType;
  notificationLifetime?: NotificationLifetime;
  notificationType?: NotificationType;
  providers?: string[];
  template?: string;
}

export interface NotificationDefinitionUpdateDto {
  displayName: string;
  description?: string;
  allowSubscriptionToClients?: boolean;
  contentType?: NotificationContentType;
  notificationLifetime?: NotificationLifetime;
  notificationType?: NotificationType;
  providers?: string[];
  template?: string;
}

export interface NotificationSendRecordDto {
  id: string;
  notification: UserNotificationDto;
  provider: string;
  reason?: string;
  sendTime: string;
  state: NotificationSendState;
  userId: string;
  userName: string;
}

export interface NotificationSendRecordGetPagedListInput {
  notificationName?: string;
  provider?: string;
  state?: NotificationSendState;
  userId?: string;
  beginSendTime?: string;
  endSendTime?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface NotificationSendInput {
  culture?: string;
  data: Record<string, unknown>;
  name: string;
  severity?: NotificationSeverity;
  toUsers?: { userId: string; userName?: string }[];
}

/** Tên hiển thị enum — khớp giá trị web (không dịch enum, chỉ map số → nhãn). */
export function severityName(value?: number): string {
  switch (value) {
    case NotificationSeverity.Success:
      return 'Success';
    case NotificationSeverity.Info:
      return 'Info';
    case NotificationSeverity.Warn:
      return 'Warn';
    case NotificationSeverity.Error:
      return 'Error';
    case NotificationSeverity.Fatal:
      return 'Fatal';
    default:
      return '';
  }
}

export function notificationTypeName(value?: number): string {
  switch (value) {
    case NotificationType.Application:
      return 'Application';
    case NotificationType.System:
      return 'System';
    case NotificationType.User:
      return 'User';
    case NotificationType.ServiceCallback:
      return 'ServiceCallback';
    default:
      return '';
  }
}

export function lifetimeName(value?: number): string {
  switch (value) {
    case NotificationLifetime.Persistent:
      return 'Persistent';
    case NotificationLifetime.OnlyOne:
      return 'OnlyOne';
    default:
      return '';
  }
}

export function contentTypeName(value?: number): string {
  switch (value) {
    case NotificationContentType.Text:
      return 'Text';
    case NotificationContentType.Html:
      return 'Html';
    case NotificationContentType.Markdown:
      return 'Markdown';
    case NotificationContentType.Json:
      return 'Json';
    default:
      return '';
  }
}

export function readStateName(value?: number): string {
  switch (value) {
    case NotificationReadState.Read:
      return 'Read';
    case NotificationReadState.UnRead:
      return 'UnRead';
    default:
      return '';
  }
}

export function sendStateName(value?: number): string {
  switch (value) {
    case NotificationSendState.None:
      return 'None';
    case NotificationSendState.Disabled:
      return 'Disabled';
    case NotificationSendState.Sent:
      return 'Sent';
    case NotificationSendState.Failed:
      return 'Failed';
    default:
      return '';
  }
}

export interface DeserializedNotification {
  title: string;
  message: string;
  description: string;
}

function extraText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return '';
  return JSON.stringify(value);
}

/**
 * Rút title/message/description từ data.extraProperties theo đúng serializer
 * web (useNotificationSerializer.deserialize). Giới hạn mobile: payload bản
 * địa hoá (extraProperties.L = true, title/message là object {name, values})
 * KHÔNG được resolve qua resource ngôn ngữ như web — hiển thị dạng JSON thô
 * để không bịa text; payload thường (string) hiển thị đúng như web.
 */
export function deserializeNotification(item: UserNotificationDto): DeserializedNotification {
  const extra = item.data?.extraProperties ?? {};
  return {
    title: extraText(extra.title),
    message: extraText(extra.message),
    description: extraText(extra.description),
  };
}
