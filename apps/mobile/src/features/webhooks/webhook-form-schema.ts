import { z } from 'zod';

/**
 * Schema form Webhook, theo DTO C# + modal web:
 * - Nhóm: tạo nhập name + displayName; sửa chỉ đổi displayName (name là
 *   key trong path, không gửi trong body UpdateDto).
 * - Định nghĩa: tạo nhập groupName + name; sửa không gửi groupName/name.
 * - Đăng ký: webhookUri bắt buộc; webhooks nhập nhiều dòng → mảng (modal
 *   web chọn từ GET .../subscriptions/availables; mobile chưa có picker
 *   nên nhập text kèm gợi ý); headers nhập JSON object (mặc định {}),
 *   mảng/chuỗi thô bị chặn; timeoutDuration nhập text số nguyên >= 0.
 */

export const webhookGroupFormSchema = z.object({
  name: z.string().trim().min(1, 'webhookGroups.nameRequired').max(256, 'webhookGroups.nameTooLong'),
  displayName: z.string().trim().min(1, 'webhookGroups.displayNameRequired').max(256, 'webhookGroups.displayNameTooLong'),
});

export type WebhookGroupFormValues = z.infer<typeof webhookGroupFormSchema>;

export const webhookGroupFormDefaults: WebhookGroupFormValues = {
  name: '',
  displayName: '',
};

export const webhookDefinitionFormSchema = z.object({
  groupName: z.string().trim().min(1, 'webhookDefinitions.groupNameRequired').max(256, 'webhookDefinitions.groupNameTooLong'),
  name: z.string().trim().min(1, 'webhookDefinitions.nameRequired').max(256, 'webhookDefinitions.nameTooLong'),
  displayName: z.string().trim().min(1, 'webhookDefinitions.displayNameRequired').max(256, 'webhookDefinitions.displayNameTooLong'),
  description: z.string().trim().max(1024, 'webhookDefinitions.descriptionTooLong').optional(),
  isEnabled: z.boolean(),
  requiredFeatures: z.string().optional(),
});

export type WebhookDefinitionFormValues = z.infer<typeof webhookDefinitionFormSchema>;

export const webhookDefinitionFormDefaults: WebhookDefinitionFormValues = {
  groupName: '',
  name: '',
  displayName: '',
  description: '',
  isEnabled: true,
  requiredFeatures: '',
};

export const webhookSubscriptionFormSchema = z.object({
  webhookUri: z.string().trim().min(1, 'webhookSubscriptions.webhookUriRequired').max(2048, 'webhookSubscriptions.webhookUriTooLong'),
  secret: z.string().trim().max(256, 'webhookSubscriptions.secretTooLong').optional(),
  description: z.string().trim().max(1024, 'webhookSubscriptions.descriptionTooLong').optional(),
  timeoutDuration: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => v === undefined || v === '' || (/^\d+$/.test(v) && Number(v) >= 0),
      'webhookSubscriptions.timeoutDurationInvalid',
    ),
  isActive: z.boolean(),
  webhooks: z.string().optional(),
  headers: z
    .string()
    .optional()
    .refine((v) => isValidHeadersJson(v), 'webhookSubscriptions.headersInvalid'),
});

export type WebhookSubscriptionFormValues = z.infer<typeof webhookSubscriptionFormSchema>;

export const webhookSubscriptionFormDefaults: WebhookSubscriptionFormValues = {
  webhookUri: '',
  secret: '',
  description: '',
  timeoutDuration: '',
  isActive: true,
  webhooks: '',
  headers: '{}',
};

/** Text nhiều dòng → mảng, mỗi dòng một giá trị, bỏ dòng trống. */
export function linesToArray(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** Parse text JSON object thành Record<string, string>; lỗi → undefined (schema chặn riêng). */
export function parseHeadersJson(value: string | undefined): Record<string, string> | undefined {
  if (value === undefined || value.trim() === '') return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) out[k] = String(v);
    return out;
  } catch {
    return undefined;
  }
}

/** Kiểm tra text có phải JSON object hợp lệ không (dùng ở schema form đăng ký). */
export function isValidHeadersJson(value: string | undefined): boolean {
  if (value === undefined || value.trim() === '') return true;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
  } catch {
    return false;
  }
}

/** Parse text số nguyên từ form; rỗng → undefined. */
export function parseTimeoutDuration(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}
