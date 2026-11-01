import { z } from 'zod';

/**
 * Schema form tạo/sửa định nghĩa tính năng (RHF + Zod), theo
 * FeatureDefinitionModal.vue: name/groupName/valueType bắt buộc khi tạo,
 * displayName bắt buộc; valueType là tên kiểu giá trị (VD
 * FreeTextStringValueType, ToggleStringValueType, SelectionStringValueType,
 * NumericValueType) — nhập dạng text vì mobile chưa có picker kiểu giá trị;
 * allowedProviders nhập nhiều dòng → mảng. Khi sửa không gửi name/groupName.
 */
export const featureDefinitionFormSchema = z.object({
  name: z.string().trim().min(1, 'featureDefinitions.nameRequired').max(256, 'featureDefinitions.nameTooLong'),
  groupName: z.string().trim().min(1, 'featureDefinitions.groupNameRequired').max(256, 'featureDefinitions.groupNameTooLong'),
  displayName: z.string().trim().min(1, 'featureDefinitions.displayNameRequired').max(256, 'featureDefinitions.displayNameTooLong'),
  description: z.string(),
  defaultValue: z.string(),
  valueType: z.string().trim().min(1, 'featureDefinitions.valueTypeRequired').max(256, 'featureDefinitions.valueTypeTooLong'),
  isAvailableToHost: z.boolean(),
  isVisibleToClients: z.boolean(),
  parentName: z.string(),
  allowedProviders: z.string(),
});

export type FeatureDefinitionFormValues = z.infer<typeof featureDefinitionFormSchema>;

export const featureDefinitionFormDefaults: FeatureDefinitionFormValues = {
  name: '',
  groupName: '',
  displayName: '',
  description: '',
  defaultValue: '',
  valueType: 'FreeTextStringValueType',
  isAvailableToHost: true,
  isVisibleToClients: true,
  parentName: '',
  allowedProviders: '',
};
