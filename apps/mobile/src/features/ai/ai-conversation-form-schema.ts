import { z } from 'zod';

/**
 * Schema form phiên hội thoại, đúng DTO C#:
 * - Tạo: name tùy chọn (backend đặt "NewConversation" khi trống),
 *   workspace bắt buộc.
 * - Đổi tên: name bắt buộc (ConversationUpdateDto.Name [Required]).
 * - Tin nhắn gửi đi: content bắt buộc (SendTextChatMessageDto.Content
 *   [Required], giới hạn bởi TextChatMessageRecordConsts.MaxContentLength
 *   — web không lộ hằng số, mobile chặn ở mức hợp lý 32000 ký tự để
 *   không gửi payload vô hạn; backend vẫn là nguồn chặn cuối).
 */
export const aiConversationCreateSchema = z.object({
  name: z.string().max(256, 'aiConversations.nameTooLong').optional(),
  workspace: z
    .string()
    .trim()
    .min(1, 'aiConversations.workspaceRequired')
    .max(256, 'aiConversations.workspaceTooLong'),
});

export type AIConversationCreateValues = z.infer<typeof aiConversationCreateSchema>;

export const aiConversationCreateDefaults: AIConversationCreateValues = {
  name: '',
  workspace: '',
};

export const aiConversationRenameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'aiConversations.nameRequired')
    .max(256, 'aiConversations.nameTooLong'),
});

export type AIConversationRenameValues = z.infer<typeof aiConversationRenameSchema>;

export const aiChatMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'aiConversations.contentRequired')
    .max(32000, 'aiConversations.contentTooLong'),
});

export type AIChatMessageValues = z.infer<typeof aiChatMessageSchema>;
