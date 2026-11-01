import { z } from 'zod';

/**
 * Schema form tạo/sửa định nghĩa thông báo. Enum nhập dạng text số (web
 * dùng Select từ enum) rồi parse ở màn hình: notificationType 0/10/20/30,
 * lifetime 0/1, contentType 0/1/2/3 — nhập sai số bị chặn ở schema, không
 * gửi lên server. Dùng string thay vì z.coerce để khớp kiểu zodResolver.
 * providers nhập dạng text, mỗi dòng một giá trị (web dùng Select từ
 * /assignable-providers; mobile chưa có picker — ghi rõ ở báo cáo vòng).
 */
function enumText(allowed: number[]) {
  return z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || v === '' || allowed.includes(Number(v)), 'notificationDefinitions.invalidNumber');
}

export const notificationDefinitionFormSchema = z.object({
  name: z.string().trim().min(1, 'notificationDefinitions.nameRequired').max(256, 'notificationDefinitions.nameTooLong'),
  groupName: z.string().trim().max(256, 'notificationDefinitions.groupNameTooLong').optional(),
  displayName: z.string().trim().min(1, 'notificationDefinitions.displayNameRequired').max(256, 'notificationDefinitions.displayNameTooLong'),
  description: z.string().trim().max(1024, 'notificationDefinitions.descriptionTooLong').optional(),
  allowSubscriptionToClients: z.boolean(),
  notificationType: enumText([0, 10, 20, 30]),
  notificationLifetime: enumText([0, 1]),
  contentType: enumText([0, 1, 2, 3]),
  providers: z.string().optional(),
  template: z.string().trim().max(256, 'notificationDefinitions.templateTooLong').optional(),
});

export type NotificationDefinitionFormValues = z.infer<typeof notificationDefinitionFormSchema>;

export const notificationDefinitionFormDefaults: NotificationDefinitionFormValues = {
  name: '',
  groupName: '',
  displayName: '',
  description: '',
  allowSubscriptionToClients: false,
  notificationType: '',
  notificationLifetime: '',
  contentType: '',
  providers: '',
  template: '',
};

/** Parse text số từ form thành number cho API; rỗng → undefined. */
export function parseEnumNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}
