import { z } from 'zod';
import { ValueType } from './claim-types';

/**
 * Schema form tạo/sửa loại claim (RHF + Zod, theo prompt mục 9).
 * Đối chiếu web ClaimTypeModal.vue: tạo mới nhập name (bắt buộc), valueType,
 * required, description, regex, regexDescription; sửa chỉ gửi 4 field mà
 * IdentityClaimTypeUpdateDto nhận (description/regex/regexDescription/required)
 * — name/valueType không đổi được qua API update nên form sửa hiển thị dạng
 * chỉ đọc. Loại claim tĩnh (isStatic) không sửa/xóa được, giống web.
 */
export const claimTypeFormSchema = z.object({
  name: z.string().trim().min(1, 'claimTypes.nameRequired').max(256, 'claimTypes.nameTooLong'),
  valueType: z.nativeEnum(ValueType),
  required: z.boolean(),
  description: z.string().optional(),
  regex: z.string().optional(),
  regexDescription: z.string().optional(),
});

export type ClaimTypeFormValues = z.infer<typeof claimTypeFormSchema>;

export const claimTypeFormDefaults: ClaimTypeFormValues = {
  name: '',
  valueType: ValueType.String,
  required: false,
  description: undefined,
  regex: undefined,
  regexDescription: undefined,
};

/** Map giá trị form sang body PUT: chỉ 4 field update, không gửi name/valueType. */
export function toClaimTypeUpdateInput(values: ClaimTypeFormValues) {
  const clean = (v?: string) => {
    const trimmed = v?.trim();
    return trimmed ? trimmed : undefined;
  };
  return {
    description: clean(values.description),
    regex: clean(values.regex),
    regexDescription: clean(values.regexDescription),
    required: values.required,
  };
}

/** Map giá trị form sang body POST tạo mới (web không nhập isStatic → mặc định false). */
export function toClaimTypeCreateInput(values: ClaimTypeFormValues) {
  const clean = (v?: string) => {
    const trimmed = v?.trim();
    return trimmed ? trimmed : undefined;
  };
  return {
    name: values.name,
    valueType: values.valueType,
    required: values.required,
    isStatic: false,
    description: clean(values.description),
    regex: clean(values.regex),
    regexDescription: clean(values.regexDescription),
  };
}
