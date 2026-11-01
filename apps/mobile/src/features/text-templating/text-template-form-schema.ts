import { z } from 'zod';

/**
 * Schema form tạo/sửa định nghĩa mẫu văn bản, theo DTO C#:
 * tạo nhập name; sửa chỉ đổi các field còn lại + concurrencyStamp
 * (name là key trong path, không gửi trong body UpdateDto).
 * Nội dung mẫu (theo culture) không qua schema này — màn nội dung
 * riêng dùng ô text multiline + lưu/khôi phục mặc định.
 */
export const textTemplateDefinitionFormSchema = z.object({
  name: z.string().trim().min(1, 'textTemplateDefinitions.nameRequired').max(256, 'textTemplateDefinitions.nameTooLong'),
  displayName: z
    .string()
    .trim()
    .min(1, 'textTemplateDefinitions.displayNameRequired')
    .max(256, 'textTemplateDefinitions.displayNameTooLong'),
  defaultCultureName: z.string().trim().max(32, 'textTemplateDefinitions.defaultCultureNameTooLong').optional(),
  localizationResourceName: z
    .string()
    .trim()
    .max(256, 'textTemplateDefinitions.localizationResourceNameTooLong')
    .optional(),
  renderEngine: z.string().trim().max(256, 'textTemplateDefinitions.renderEngineTooLong').optional(),
  isInlineLocalized: z.boolean(),
  isLayout: z.boolean(),
  layout: z.string().trim().max(1024, 'textTemplateDefinitions.layoutTooLong').optional(),
});

export type TextTemplateDefinitionFormValues = z.infer<typeof textTemplateDefinitionFormSchema>;

export const textTemplateDefinitionFormDefaults: TextTemplateDefinitionFormValues = {
  name: '',
  displayName: '',
  defaultCultureName: '',
  localizationResourceName: '',
  renderEngine: '',
  isInlineLocalized: false,
  isLayout: false,
  layout: '',
};
