import { z } from 'zod';

/**
 * Schema form tạo/sửa phạm vi OpenIddict (RHF + Zod).
 * Backend yêu cầu name bắt buộc (CreateOrUpdateDto); resources nhập dạng
 * nhiều dòng, mỗi dòng một giá trị, chuyển thành mảng lúc submit.
 */
export const scopeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'openiddictScopes.nameRequired')
    .max(256, 'openiddictScopes.nameTooLong'),
  displayName: z.string().trim().max(256, 'openiddictScopes.displayNameTooLong'),
  description: z.string().trim().max(2048, 'openiddictScopes.descriptionTooLong'),
  resources: z.string(),
});

export type ScopeFormValues = z.infer<typeof scopeFormSchema>;

export const scopeFormDefaults: ScopeFormValues = {
  name: '',
  displayName: '',
  description: '',
  resources: '',
};
