import { z } from 'zod';

/**
 * Schema form tạo/sửa định nghĩa quyền (RHF + Zod), theo
 * PermissionDefinitionModal.vue: name/groupName bắt buộc khi tạo, displayName
 * bắt buộc, isEnabled mặc định true, providers nhập nhiều dòng → mảng,
 * stateCheckers là chuỗi. Khi sửa không gửi name/groupName (key trong path).
 */
export const permissionDefinitionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'permissionDefinitions.nameRequired')
    .max(256, 'permissionDefinitions.nameTooLong'),
  groupName: z
    .string()
    .trim()
    .min(1, 'permissionDefinitions.groupNameRequired')
    .max(256, 'permissionDefinitions.groupNameTooLong'),
  displayName: z
    .string()
    .trim()
    .min(1, 'permissionDefinitions.displayNameRequired')
    .max(256, 'permissionDefinitions.displayNameTooLong'),
  isEnabled: z.boolean(),
  parentName: z.string(),
  providers: z.string(),
  stateCheckers: z.string(),
});

export type PermissionDefinitionFormValues = z.infer<typeof permissionDefinitionFormSchema>;

export const permissionDefinitionFormDefaults: PermissionDefinitionFormValues = {
  name: '',
  groupName: '',
  displayName: '',
  isEnabled: true,
  parentName: '',
  providers: '',
  stateCheckers: '',
};
