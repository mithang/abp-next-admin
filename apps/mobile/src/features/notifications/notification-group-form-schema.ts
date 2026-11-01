import { z } from 'zod';

/** Schema form tạo/sửa nhóm thông báo: tạo nhập name; sửa chỉ đổi displayName/description/allowSubscriptionToClients. */
export const notificationGroupFormSchema = z.object({
  name: z.string().trim().min(1, 'notificationGroups.nameRequired').max(256, 'notificationGroups.nameTooLong'),
  displayName: z.string().trim().min(1, 'notificationGroups.displayNameRequired').max(256, 'notificationGroups.displayNameTooLong'),
  description: z.string().trim().max(1024, 'notificationGroups.descriptionTooLong').optional(),
  allowSubscriptionToClients: z.boolean(),
});

export type NotificationGroupFormValues = z.infer<typeof notificationGroupFormSchema>;

export const notificationGroupFormDefaults: NotificationGroupFormValues = {
  name: '',
  displayName: '',
  description: '',
  allowSubscriptionToClients: false,
};
