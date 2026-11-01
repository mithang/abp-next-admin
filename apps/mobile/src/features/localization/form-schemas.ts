import { z } from 'zod';

/**
 * Schema form 3 trang lá bản địa hoá (RHF + Zod), theo các modal web:
 * - Ngôn ngữ: cultureName + displayName bắt buộc khi tạo; sửa chỉ gửi
 *   displayName nên form sửa không có ô cultureName/uiCultureName sửa được.
 * - Tài nguyên: name + displayName bắt buộc; enable mặc định bật.
 * - Văn bản: cultureName/resourceName/key bắt buộc, value bắt buộc (modal
 *   web required cả 4); sửa (edit) khóa cultureName đích có thể đổi để tải
 *   lại bản dịch như modal web (onLanguageChange), còn resourceName/key
 *   bị khóa — form nhận cờ isEdit để khóa 2 ô đó.
 */

export const languageFormSchema = z.object({
  cultureName: z.string().trim().min(1, 'languages.cultureNameRequired').max(256, 'languages.cultureNameTooLong'),
  uiCultureName: z.string(),
  displayName: z.string().trim().min(1, 'languages.displayNameRequired').max(256, 'languages.displayNameTooLong'),
});

export type LanguageFormValues = z.infer<typeof languageFormSchema>;

export const languageFormDefaults: LanguageFormValues = {
  cultureName: '',
  uiCultureName: '',
  displayName: '',
};

export const resourceFormSchema = z.object({
  name: z.string().trim().min(1, 'resources.nameRequired').max(256, 'resources.nameTooLong'),
  displayName: z.string().trim().min(1, 'resources.displayNameRequired').max(256, 'resources.displayNameTooLong'),
  description: z.string(),
  enable: z.boolean(),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export const resourceFormDefaults: ResourceFormValues = {
  name: '',
  displayName: '',
  description: '',
  enable: true,
};

export const textFormSchema = z.object({
  cultureName: z.string().trim().min(1, 'texts.cultureNameRequired'),
  resourceName: z.string().trim().min(1, 'texts.resourceNameRequired'),
  key: z.string().trim().min(1, 'texts.keyRequired'),
  value: z.string().trim().min(1, 'texts.valueRequired'),
});

export type TextFormValues = z.infer<typeof textFormSchema>;

export const textFormDefaults: TextFormValues = {
  cultureName: '',
  resourceName: '',
  key: '',
  value: '',
};

/**
 * Params điều hướng tới form văn bản ở chế độ sửa, đúng modal web:
 * mở từ một dòng so sánh → sửa bản dịch của culture ĐÍCH, nên cultureName
 * của form là targetCultureName của dòng, resourceName/key khóa lại.
 */
export function textEditInitialValues(row: {
  resourceName: string;
  key: string;
  targetCultureName: string;
  targetValue?: string | null;
}): TextFormValues {
  return {
    cultureName: row.targetCultureName,
    resourceName: row.resourceName,
    key: row.key,
    value: row.targetValue ?? '',
  };
}
