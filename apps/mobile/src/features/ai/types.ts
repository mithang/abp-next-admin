/**
 * Kiểu cho nhóm AI, đối chiếu trực tiếp backend
 * LINGYUN.Abp.AIManagement (Application.Contracts), không chỉ copy web:
 * - Tools: GET/POST /api/ai-management/tools, GET/PUT/DELETE
 *   /api/ai-management/tools/{id}, GET .../available-providers.
 * - Workspaces: tương tự dưới /api/ai-management/workspaces (+
 *   .../available-providers trả { name, models[] }).
 * - Conversations: GET/POST /api/ai-management/chats/conversations,
 *   GET/PUT/DELETE /api/ai-management/chats/conversations/{id}.
 *   LƯU Ý: web gọi PUT tới /api/ai-management/conversations/{id} (không có
 *   "chats/") — route đó KHÔNG có trong Swagger của AllInOne (GET không
 *   token trả 404), còn /chats/conversations/{id} có cả PUT (swagger
 *   paths, đã xác minh vòng 12). Mobile dùng route swagger-verified.
 * - Chat messages: GET /api/ai-management/chats?conversationId=... (phân
 *   trang ABP); POST /api/ai-management/chats là SSE (xem sse.ts), không
 *   phải JSON thường.
 * DTO C# dùng PascalCase; JSON trả về camelCase như mọi API ABP khác.
 * ApiKey KHÔNG có trong WorkspaceDefinitionRecordDto trả về (chỉ gửi đi
 * khi tạo/đặt lại); mobile không bao giờ hiển thị apiKey đã lưu.
 */

export interface PagedInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface AIToolDefinitionRecordDto {
  id: string;
  name: string;
  provider: string;
  description?: string | null;
  isEnabled: boolean;
  isSystem: boolean;
  isGlobal: boolean;
  isStatic: boolean;
  stateCheckers?: string | null;
  concurrencyStamp: string;
  creationTime?: string;
  extraProperties?: Record<string, unknown>;
}

export interface AIToolDefinitionRecordGetPagedListInput extends PagedInput {
  isEnabled?: boolean;
  provider?: string;
}

export interface AIToolDefinitionRecordCreateOrUpdateDto {
  provider: string;
  description?: string;
  isEnabled: boolean;
  isGlobal: boolean;
  stateCheckers?: string;
  extraProperties?: Record<string, unknown>;
}

export interface AIToolDefinitionRecordCreateDto extends AIToolDefinitionRecordCreateOrUpdateDto {
  name: string;
}

/** UpdateDto C# KHÔNG có name (name chỉ ở CreateDto) — sửa không đổi tên. */
export interface AIToolDefinitionRecordUpdateDto extends AIToolDefinitionRecordCreateOrUpdateDto {
  concurrencyStamp: string;
}

export interface AIToolPropertyDescriptorDto {
  name: string;
  required: boolean;
  valueType: string;
  options: { name: string; value: unknown }[];
  displayName: string;
  description?: string | null;
  dependencies: { name: string; value: unknown }[];
}

export interface AIToolProviderDto {
  name: string;
  properties: AIToolPropertyDescriptorDto[];
}

export interface WorkspaceDefinitionRecordDto {
  id: string;
  name: string;
  provider: string;
  modelName: string;
  displayName: string;
  description?: string | null;
  apiBaseUrl?: string | null;
  systemPrompt?: string | null;
  instructions?: string | null;
  temperature?: number | null;
  maxOutputTokens?: number | null;
  frequencyPenalty?: number | null;
  presencePenalty?: number | null;
  isEnabled: boolean;
  isSystem: boolean;
  isStatic: boolean;
  tools?: string[] | null;
  stateCheckers?: string | null;
  concurrencyStamp: string;
  creationTime?: string;
  extraProperties?: Record<string, unknown>;
}

export interface WorkspaceDefinitionRecordGetPagedListInput extends PagedInput {
  provider?: string;
  modelName?: string;
}

export interface WorkspaceDefinitionRecordCreateOrUpdateDto {
  provider: string;
  modelName: string;
  displayName: string;
  description?: string;
  /** Chỉ gửi khi tạo/đặt lại; DTO trả về không bao giờ chứa apiKey. */
  apiKey?: string;
  apiBaseUrl?: string;
  systemPrompt?: string;
  instructions?: string;
  temperature?: number;
  maxOutputTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  isEnabled: boolean;
  tools?: string[];
  stateCheckers?: string;
  extraProperties?: Record<string, unknown>;
}

export interface WorkspaceDefinitionRecordCreateDto extends WorkspaceDefinitionRecordCreateOrUpdateDto {
  name: string;
}

/** UpdateDto C# KHÔNG có name (name chỉ ở CreateDto) — sửa không đổi tên. */
export interface WorkspaceDefinitionRecordUpdateDto extends WorkspaceDefinitionRecordCreateOrUpdateDto {
  concurrencyStamp: string;
}

export interface ChatClientProviderDto {
  name: string;
  models: string[];
}

export interface ConversationDto {
  id: string;
  name: string;
  workspace: string;
  createdAt: string;
  expiredAt: string;
  updateAt?: string | null;
  creationTime?: string;
}

export type ConversationGetListInput = PagedInput;

export interface ConversationCreateDto {
  name?: string;
  workspace: string;
}

export interface ConversationUpdateDto {
  name: string;
}

export interface TextChatMessageDto {
  id: string;
  workspace: string;
  createdAt: string;
  role: string;
  userId?: string | null;
  conversationId?: string | null;
  /** Nội dung tin nhắn người dùng (TextChatMessage.Content). */
  content: string;
  /** Câu trả lời của assistant đã lưu (có thể null khi chưa trả lời). */
  replyMessage?: string | null;
  replyAt?: string | null;
  creationTime?: string;
}

export interface TextChatMessageGetListInput extends PagedInput {
  conversationId: string;
}

export interface SendTextChatMessageDto {
  conversationId: string;
  workspace: string;
  content: string;
}

/** Một công cụ được coi là chỉ xem khi hệ thống/tĩnh — đúng luật web (modal khóa nút xác nhận). */
export function isReadOnlyTool(item: AIToolDefinitionRecordDto): boolean {
  return item.isSystem || item.isStatic;
}

/** Workspace tĩnh thì web không cho sửa; mobile ẩn nút Sửa tương tự. */
export function isReadOnlyWorkspace(item: WorkspaceDefinitionRecordDto): boolean {
  return item.isStatic;
}
