import { z } from 'zod';

/**
 * Schema form không gian làm việc, đúng DTO C#:
 * - Tạo: name bắt buộc; sửa: name không đổi (màn form ẩn field).
 * - provider/modelName/displayName bắt buộc (DTO [Required]).
 * - apiKey: tạo tùy chọn; sửa để trống = giữ key cũ (backend chỉ mã hóa
 *   và ghi đè khi apiKey không rỗng — WorkspaceDefinitionAppService).
 *   Màn "Đặt lại API key" dùng schema riêng bên dưới (chỉ apiKey bắt buộc).
 * - Các số (temperature, penalties, maxOutputTokens) nhập text, đổi sang
 *   số ở lúc submit; sai định dạng bị chặn ở schema.
 */
const optionalNumberText = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Number(v)), 'aiWorkspaces.invalidNumber')
  .optional();

export const aiWorkspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'aiWorkspaces.nameRequired')
    .max(256, 'aiWorkspaces.nameTooLong')
    .optional(),
  provider: z
    .string()
    .trim()
    .min(1, 'aiWorkspaces.providerRequired')
    .max(256, 'aiWorkspaces.providerTooLong'),
  modelName: z
    .string()
    .trim()
    .min(1, 'aiWorkspaces.modelNameRequired')
    .max(256, 'aiWorkspaces.modelNameTooLong'),
  displayName: z
    .string()
    .trim()
    .min(1, 'aiWorkspaces.displayNameRequired')
    .max(256, 'aiWorkspaces.displayNameTooLong'),
  description: z.string().max(2048, 'aiWorkspaces.descriptionTooLong').optional(),
  apiKey: z.string().max(1024, 'aiWorkspaces.apiKeyTooLong').optional(),
  apiBaseUrl: z.string().max(1024, 'aiWorkspaces.apiBaseUrlTooLong').optional(),
  systemPrompt: z.string().max(8192, 'aiWorkspaces.systemPromptTooLong').optional(),
  instructions: z.string().max(8192, 'aiWorkspaces.instructionsTooLong').optional(),
  temperature: optionalNumberText,
  maxOutputTokens: optionalNumberText,
  frequencyPenalty: optionalNumberText,
  presencePenalty: optionalNumberText,
  isEnabled: z.boolean(),
  tools: z.string().optional(),
  stateCheckers: z.string().max(1024, 'aiWorkspaces.stateCheckersTooLong').optional(),
});

export type AIWorkspaceFormValues = z.infer<typeof aiWorkspaceFormSchema>;

export const aiWorkspaceFormDefaults: AIWorkspaceFormValues = {
  name: '',
  provider: '',
  modelName: '',
  displayName: '',
  description: '',
  apiKey: '',
  apiBaseUrl: '',
  systemPrompt: '',
  instructions: '',
  temperature: '',
  maxOutputTokens: '',
  frequencyPenalty: '',
  presencePenalty: '',
  isEnabled: true,
  tools: '',
  stateCheckers: '',
};

/** Đổi các field số dạng text sang number/undefined và tools dạng dòng sang mảng. */
export function toWorkspaceNumericFields(values: AIWorkspaceFormValues) {
  const toNum = (v?: string) => {
    const trimmed = (v ?? '').trim();
    return trimmed === '' ? undefined : Number(trimmed);
  };
  const toInt = (v?: string) => {
    const n = toNum(v);
    return n === undefined ? undefined : Math.trunc(n);
  };
  const tools = (values.tools ?? '')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    temperature: toNum(values.temperature),
    maxOutputTokens: toInt(values.maxOutputTokens),
    frequencyPenalty: toNum(values.frequencyPenalty),
    presencePenalty: toNum(values.presencePenalty),
    tools: tools.length > 0 ? tools : undefined,
  };
}

/** Schema màn đặt lại API key: chỉ apiKey bắt buộc, đúng modal web (InputPassword required). */
export const aiWorkspaceResetApiKeySchema = z.object({
  apiKey: z
    .string()
    .trim()
    .min(1, 'aiWorkspaces.apiKeyRequired')
    .max(1024, 'aiWorkspaces.apiKeyTooLong'),
});

export type AIWorkspaceResetApiKeyValues = z.infer<typeof aiWorkspaceResetApiKeySchema>;
