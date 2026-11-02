import { z } from 'zod';

/**
 * Schema form gửi thông báo (web NotificationSendModal): name khóa theo
 * định nghĩa đã chọn; data gửi đi là { title, message, description } như
 * web; severity nhập dạng số 0/10/20/30/40 (để trống = mặc định server).
 */
export const notificationSendFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'notificationSend.titleRequired')
    .max(512, 'notificationSend.titleTooLong'),
  message: z
    .string()
    .trim()
    .min(1, 'notificationSend.messageRequired')
    .max(4096, 'notificationSend.messageTooLong'),
  description: z.string().trim().max(1024, 'notificationSend.descriptionTooLong').optional(),
  culture: z.string().trim().max(32, 'notificationSend.cultureTooLong').optional(),
  severity: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => v === undefined || v === '' || [0, 10, 20, 30, 40].includes(Number(v)),
      'notificationSend.invalidNumber',
    ),
});

export type NotificationSendFormValues = z.infer<typeof notificationSendFormSchema>;

export const notificationSendFormDefaults: NotificationSendFormValues = {
  title: '',
  message: '',
  description: '',
  culture: '',
  severity: '',
};
