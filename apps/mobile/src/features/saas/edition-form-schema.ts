import { z } from 'zod';

/**
 * Schema form phiên bản (edition), đúng DTO C#: chỉ có displayName bắt
 * buộc (+ extraProperties từ ExtensibleObject). Sửa gửi kèm
 * concurrencyStamp lấy từ detail (màn form lo, không nằm trong schema).
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
  }, 'saasEditions.invalidExtraPropertiesJson')
  .optional();

export const editionFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'saasEditions.displayNameRequired')
    .max(256, 'saasEditions.displayNameTooLong'),
  extraPropertiesJson: optionalJsonObject,
});

export type EditionFormValues = z.infer<typeof editionFormSchema>;

export const editionFormDefaults: EditionFormValues = {
  displayName: '',
  extraPropertiesJson: '',
};

/** Đổi extraPropertiesJson rỗng → undefined, còn lại parse thành object. */
export function parseExtraPropertiesJson(
  values: EditionFormValues,
): Record<string, unknown> | undefined {
  const trimmed = (values.extraPropertiesJson ?? '').trim();
  if (trimmed === '') return undefined;
  return JSON.parse(trimmed) as Record<string, unknown>;
}
