import { apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import type {
  AIToolDefinitionRecordCreateDto,
  AIToolDefinitionRecordDto,
  AIToolDefinitionRecordUpdateDto,
  AIToolDefinitionRecordGetPagedListInput,
  AIToolProviderDto,
  ChatClientProviderDto,
  ConversationCreateDto,
  ConversationDto,
  ConversationGetListInput,
  ConversationUpdateDto,
  TextChatMessageDto,
  TextChatMessageGetListInput,
  WorkspaceDefinitionRecordCreateDto,
  WorkspaceDefinitionRecordDto,
  WorkspaceDefinitionRecordUpdateDto,
  WorkspaceDefinitionRecordGetPagedListInput,
} from './types';

/* ---------------- Công cụ AI: /api/ai-management/tools ---------------- */

/** GET /api/ai-management/tools — phân trang ABP, lọc filter/isEnabled/provider. */
export function getAIToolsPaged(input: AIToolDefinitionRecordGetPagedListInput = {}) {
  return apiRequest<PagedResult<AIToolDefinitionRecordDto>>('/api/ai-management/tools', {
    method: 'GET',
    params: {
      filter: input.filter,
      isEnabled: input.isEnabled,
      provider: input.provider,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/ai-management/tools/{id} */
export function getAITool(id: string) {
  return apiRequest<AIToolDefinitionRecordDto>(`/api/ai-management/tools/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/ai-management/tools */
export function createAITool(input: AIToolDefinitionRecordCreateDto) {
  return apiRequest<AIToolDefinitionRecordDto>('/api/ai-management/tools', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/ai-management/tools/{id} — body bắt buộc có concurrencyStamp (DTO C#). */
export function updateAITool(id: string, input: AIToolDefinitionRecordUpdateDto) {
  return apiRequest<AIToolDefinitionRecordDto>(`/api/ai-management/tools/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/ai-management/tools/{id} */
export function deleteAITool(id: string) {
  return apiRequest<void>(`/api/ai-management/tools/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** GET /api/ai-management/tools/available-providers — ListResult { name, properties[] }. */
export function getAIToolProviders() {
  return apiRequest<ListResult<AIToolProviderDto>>('/api/ai-management/tools/available-providers', {
    method: 'GET',
  });
}

/* ---------------- Không gian làm việc: /api/ai-management/workspaces ---------------- */

/** GET /api/ai-management/workspaces — phân trang ABP, lọc filter/provider/modelName. */
export function getWorkspacesPaged(input: WorkspaceDefinitionRecordGetPagedListInput = {}) {
  return apiRequest<PagedResult<WorkspaceDefinitionRecordDto>>('/api/ai-management/workspaces', {
    method: 'GET',
    params: {
      filter: input.filter,
      provider: input.provider,
      modelName: input.modelName,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/ai-management/workspaces/{id} */
export function getWorkspace(id: string) {
  return apiRequest<WorkspaceDefinitionRecordDto>(`/api/ai-management/workspaces/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/ai-management/workspaces */
export function createWorkspace(input: WorkspaceDefinitionRecordCreateDto) {
  return apiRequest<WorkspaceDefinitionRecordDto>('/api/ai-management/workspaces', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/ai-management/workspaces/{id} — body bắt buộc có concurrencyStamp. */
export function updateWorkspace(id: string, input: WorkspaceDefinitionRecordUpdateDto) {
  return apiRequest<WorkspaceDefinitionRecordDto>(`/api/ai-management/workspaces/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/ai-management/workspaces/{id} */
export function deleteWorkspace(id: string) {
  return apiRequest<void>(`/api/ai-management/workspaces/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** GET /api/ai-management/workspaces/available-providers — ListResult { name, models[] }. */
export function getWorkspaceProviders() {
  return apiRequest<ListResult<ChatClientProviderDto>>('/api/ai-management/workspaces/available-providers', {
    method: 'GET',
  });
}

/* ---------------- Phiên hội thoại: /api/ai-management/chats/conversations ---------------- */

/** GET /api/ai-management/chats/conversations — backend chỉ trả phiên của chính user tạo. */
export function getConversationsPaged(input: ConversationGetListInput = {}) {
  return apiRequest<PagedResult<ConversationDto>>('/api/ai-management/chats/conversations', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/ai-management/chats/conversations/{id} */
export function getConversation(id: string) {
  return apiRequest<ConversationDto>(`/api/ai-management/chats/conversations/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/ai-management/chats/conversations — name tùy chọn, workspace bắt buộc. */
export function createConversation(input: ConversationCreateDto) {
  return apiRequest<ConversationDto>('/api/ai-management/chats/conversations', {
    method: 'POST',
    body: input,
  });
}

/**
 * PUT /api/ai-management/chats/conversations/{id} — đổi tên.
 * Route đã xác minh qua Swagger; KHÔNG dùng route /api/ai-management/conversations/{id}
 * mà web dùng (route đó không tồn tại trên AllInOne, GET không token trả 404).
 */
export function updateConversation(id: string, input: ConversationUpdateDto) {
  return apiRequest<ConversationDto>(`/api/ai-management/chats/conversations/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/ai-management/chats/conversations/{id} */
export function deleteConversation(id: string) {
  return apiRequest<void>(`/api/ai-management/chats/conversations/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/* ---------------- Tin nhắn: GET /api/ai-management/chats (POST là SSE, xem sse.ts) ---------------- */

/** GET /api/ai-management/chats?conversationId=... — lịch sử tin nhắn, phân trang ABP. */
export function getChatMessagesPaged(input: TextChatMessageGetListInput) {
  return apiRequest<PagedResult<TextChatMessageDto>>('/api/ai-management/chats', {
    method: 'GET',
    params: {
      conversationId: input.conversationId,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 50,
      sorting: input.sorting,
    },
  });
}
