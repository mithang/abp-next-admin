import { z } from 'zod';

/**
 * Form đơn vị tổ chức theo OrganizationUnitCreateDto/UpdateDto của web:
 * chỉ có displayName là trường sửa được; parentId chỉ chọn lúc tạo (từ nút
 * "Tạo đơn vị con" ở màn hình chi tiết) và hiển thị chỉ đọc, không sửa.
 * i18n: message dùng key để tầng UI dịch (theo pattern role-form-schema).
 */
export const organizationUnitFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'organizationUnits.displayNameRequired')
    .max(256, 'organizationUnits.displayNameTooLong'),
  parentId: z.string().optional(),
});

export type OrganizationUnitFormValues = z.infer<typeof organizationUnitFormSchema>;

export const organizationUnitFormDefaults: OrganizationUnitFormValues = { displayName: '', parentId: undefined };

/** Create gửi đủ displayName + parentId (nếu có); update chỉ gửi displayName. */
export function toOrganizationUnitCreateInput(values: OrganizationUnitFormValues) {
  return { displayName: values.displayName.trim(), parentId: values.parentId || undefined };
}

export function toOrganizationUnitUpdateInput(values: OrganizationUnitFormValues) {
  return { displayName: values.displayName.trim() };
}
