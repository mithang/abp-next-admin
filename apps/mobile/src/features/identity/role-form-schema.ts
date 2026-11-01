import { z } from 'zod';

/**
 * Schema form tạo/sửa vai trò (RHF + Zod, theo prompt mục 9).
 * Backend yêu cầu name bắt buộc; isDefault/isPublic là cờ boolean.
 * Static role không sửa được tên ở backend — UI vẫn gửi đủ field, backend tự chặn.
 */
export const roleFormSchema = z.object({
  name: z.string().trim().min(1, 'roles.nameRequired').max(256, 'roles.nameTooLong'),
  isDefault: z.boolean(),
  isPublic: z.boolean(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export const roleFormDefaults: RoleFormValues = { name: '', isDefault: false, isPublic: false };
