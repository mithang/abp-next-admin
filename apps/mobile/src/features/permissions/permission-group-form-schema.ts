import { z } from 'zod';

/** Schema form tạo/sửa nhóm quyền: tạo nhập name (bắt buộc), sửa chỉ đổi displayName. */
export const permissionGroupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'permissionGroups.nameRequired')
    .max(256, 'permissionGroups.nameTooLong'),
  displayName: z
    .string()
    .trim()
    .min(1, 'permissionGroups.displayNameRequired')
    .max(256, 'permissionGroups.displayNameTooLong'),
});

export type PermissionGroupFormValues = z.infer<typeof permissionGroupFormSchema>;

export const permissionGroupFormDefaults: PermissionGroupFormValues = {
  name: '',
  displayName: '',
};
