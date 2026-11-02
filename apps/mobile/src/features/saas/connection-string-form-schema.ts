import { z } from 'zod';

/**
 * Schema cho màn chuỗi kết nối của tenant, đúng DTO C#:
 * - Đặt chuỗi kết nối: name + value đều bắt buộc (TenantConnectionStringSetInput).
 * - Kiểm tra chuỗi kết nối: provider bắt buộc, connectionString bắt buộc,
 *   name tùy chọn (TenantConnectionStringCheckInput).
 * Giá trị value/connectionString là credential: chỉ gửi đi, không render lại.
 */
export const connectionStringSetFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'saasConnectionStrings.nameRequired')
    .max(256, 'saasConnectionStrings.nameTooLong'),
  value: z.string().min(1, 'saasConnectionStrings.valueRequired'),
});

export type ConnectionStringSetFormValues = z.infer<typeof connectionStringSetFormSchema>;

export const connectionStringSetFormDefaults: ConnectionStringSetFormValues = {
  name: '',
  value: '',
};

export const connectionStringCheckFormSchema = z.object({
  provider: z
    .string()
    .trim()
    .min(1, 'saasConnectionStrings.providerRequired')
    .max(256, 'saasConnectionStrings.providerTooLong'),
  name: z.string().trim().optional(),
  connectionString: z.string().min(1, 'saasConnectionStrings.connectionStringRequired'),
});

export type ConnectionStringCheckFormValues = z.infer<typeof connectionStringCheckFormSchema>;

export const connectionStringCheckFormDefaults: ConnectionStringCheckFormValues = {
  provider: '',
  name: '',
  connectionString: '',
};
