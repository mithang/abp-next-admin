import { describe, it, expect } from '@jest/globals';
import { aiToolFormSchema, parseExtraPropertiesJson } from '../ai-tool-form-schema';
import {
  aiWorkspaceFormSchema,
  aiWorkspaceResetApiKeySchema,
  toWorkspaceNumericFields,
} from '../ai-workspace-form-schema';
import {
  aiChatMessageSchema,
  aiConversationCreateSchema,
  aiConversationRenameSchema,
} from '../ai-conversation-form-schema';

describe('ai form schemas', () => {
  it('tool: provider bắt buộc, extraProperties JSON sai bị chặn, JSON object hợp lệ parse được', () => {
    expect(
      aiToolFormSchema.safeParse({ provider: '', isEnabled: true, isGlobal: false }).success,
    ).toBe(false);
    expect(
      aiToolFormSchema.safeParse({
        provider: 'p',
        isEnabled: true,
        isGlobal: false,
        extraPropertiesJson: '[1]',
      }).success,
    ).toBe(false);
    expect(
      aiToolFormSchema.safeParse({
        provider: 'p',
        isEnabled: true,
        isGlobal: false,
        extraPropertiesJson: '{"a":1}',
      }).success,
    ).toBe(true);
    expect(
      parseExtraPropertiesJson({
        provider: 'p',
        isEnabled: true,
        isGlobal: false,
        extraPropertiesJson: '{"a":1}',
      }),
    ).toEqual({
      a: 1,
    });
    expect(
      parseExtraPropertiesJson({
        provider: 'p',
        isEnabled: true,
        isGlobal: false,
        extraPropertiesJson: '',
      }),
    ).toBeUndefined();
  });

  it('workspace: provider/model/displayName bắt buộc; số sai bị chặn; đổi số/dòng tools đúng', () => {
    expect(
      aiWorkspaceFormSchema.safeParse({
        provider: 'p',
        modelName: 'm',
        displayName: '',
        isEnabled: true,
      }).success,
    ).toBe(false);
    expect(
      aiWorkspaceFormSchema.safeParse({
        provider: 'p',
        modelName: 'm',
        displayName: 'W',
        temperature: 'abc',
        isEnabled: true,
      }).success,
    ).toBe(false);
    const values = aiWorkspaceFormSchema.parse({
      provider: 'p',
      modelName: 'm',
      displayName: 'W',
      temperature: '0.7',
      maxOutputTokens: '1000',
      tools: 'tool-a\ntool-b\n',
      isEnabled: true,
    });
    const numeric = toWorkspaceNumericFields(values);
    expect(numeric.temperature).toBe(0.7);
    expect(numeric.maxOutputTokens).toBe(1000);
    expect(numeric.tools).toEqual(['tool-a', 'tool-b']);
    expect(aiWorkspaceResetApiKeySchema.safeParse({ apiKey: '' }).success).toBe(false);
    expect(aiWorkspaceResetApiKeySchema.safeParse({ apiKey: 'new-key' }).success).toBe(true);
  });

  it('conversation: tạo cần workspace, tên trống được; đổi tên cần tên; tin nhắn rỗng bị chặn', () => {
    expect(aiConversationCreateSchema.safeParse({ workspace: '' }).success).toBe(false);
    expect(aiConversationCreateSchema.safeParse({ workspace: 'ws' }).success).toBe(true);
    expect(aiConversationRenameSchema.safeParse({ name: '  ' }).success).toBe(false);
    expect(aiChatMessageSchema.safeParse({ content: '   ' }).success).toBe(false);
    expect(aiChatMessageSchema.safeParse({ content: 'hello' }).success).toBe(true);
  });
});
