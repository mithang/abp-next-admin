import { z } from 'zod';

/** Schema form tạo/sửa nhóm tính năng: tạo nhập name (bắt buộc), sửa chỉ đổi displayName. */
export const featureGroupFormSchema = z.object({
  name: z.string().trim().min(1, 'featureGroups.nameRequired').max(256, 'featureGroups.nameTooLong'),
  displayName: z.string().trim().min(1, 'featureGroups.displayNameRequired').max(256, 'featureGroups.displayNameTooLong'),
});

export type FeatureGroupFormValues = z.infer<typeof featureGroupFormSchema>;

export const featureGroupFormDefaults: FeatureGroupFormValues = {
  name: '',
  displayName: '',
};
