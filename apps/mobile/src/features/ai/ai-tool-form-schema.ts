import { z } from 'zod';

/**
 * Schema form công cụ AI, đúng DTO C#:
 * - Tạo: name bắt buộc; sửa: name là khóa định danh, không đổi (màn form ẩn field).
 * - provider bắt buộc; description/stateCheckers tùy chọn.
 * - extraProperties: các thuộc tính động theo provider (web render từ
 *   AIToolProviderDto.properties) — mobile nhập JSON object; chuỗi rỗng
 *   nghĩa là không có thuộc tính phụ; JSON sai bị chặn ở schema thay vì
 *   gửi rác lên backend. Đổi sang object ở lúc submit, không dùng transform.
 */
const optionalJsonObject = z
  .string()
  .trim()
  .refine((v) => {
    if (v === '') return true;
    try {
      const parsed: unknown = JSON.parse(v);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, 'aiTools.invalidExtraPropertiesJson')
  .optional();

export const aiToolFormSchema = z.object({
  name: z.string().trim().min(1, 'aiTools.nameRequired').max(256, 'aiTools.nameTooLong').optional(),
  provider: z.string().trim().min(1, 'aiTools.providerRequired').max(256, 'aiTools.providerTooLong'),
  description: z.string().max(1024, 'aiTools.descriptionTooLong').optional(),
  isEnabled: z.boolean(),
  isGlobal: z.boolean(),
  stateCheckers: z.string().max(1024, 'aiTools.stateCheckersTooLong').optional(),
  extraPropertiesJson: optionalJsonObject,
});

export type AIToolFormValues = z.infer<typeof aiToolFormSchema>;

export const aiToolFormDefaults: AIToolFormValues = {
  name: '',
  provider: '',
  description: '',
  isEnabled: true,
  isGlobal: false,
  stateCheckers: '',
  extraPropertiesJson: '',
};

/** Đổi extraPropertiesJson rỗng → undefined, còn lại parse thành object. */
export function parseExtraPropertiesJson(values: AIToolFormValues): Record<string, unknown> | undefined {
  const trimmed = (values.extraPropertiesJson ?? '').trim();
  if (trimmed === '') return undefined;
  return JSON.parse(trimmed) as Record<string, unknown>;
}
