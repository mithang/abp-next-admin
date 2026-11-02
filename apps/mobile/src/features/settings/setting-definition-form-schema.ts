import { z } from 'zod';

/**
 * Schema form tạo/sửa định nghĩa cài đặt (RHF + Zod), theo
 * SettingDefinitionModal.vue: name/displayName bắt buộc; providers nhập
 * nhiều dòng → mảng; khi sửa không gửi name/isStatic, giữ nguyên
 * concurrencyStamp + extraProperties của bản ghi hiện có.
 */
export const settingDefinitionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'settingDefinitions.nameRequired')
    .max(256, 'settingDefinitions.nameTooLong'),
  displayName: z
    .string()
    .trim()
    .min(1, 'settingDefinitions.displayNameRequired')
    .max(256, 'settingDefinitions.displayNameTooLong'),
  description: z.string(),
  defaultValue: z.string(),
  isEncrypted: z.boolean(),
  isInherited: z.boolean(),
  isVisibleToClients: z.boolean(),
  providers: z.string(),
});

export type SettingDefinitionFormValues = z.infer<typeof settingDefinitionFormSchema>;

export const settingDefinitionFormDefaults: SettingDefinitionFormValues = {
  name: '',
  displayName: '',
  description: '',
  defaultValue: '',
  isEncrypted: false,
  isInherited: false,
  isVisibleToClients: true,
  providers: '',
};
