import { z } from 'zod';

/**
 * Schema form từ điển dữ liệu + mục, đúng DTO C#:
 * - Từ điển tạo: name/displayName bắt buộc, description tùy chọn,
 *   parentId Guid tùy chọn (để trống = gốc). Sửa: không gửi parentId
 *   (UpdateDto không có) — màn sửa ẩn field này, đổi cha qua move riêng.
 * - Mục tạo: name bắt buộc; sửa: name khóa (UpdateDto không có name,
 *   xác định bằng name trên URL). displayName bắt buộc cả hai.
 * - valueType nhập số: chỉ 0–5 như modal web chào (Object=6 có trong
 *   enum backend nhưng web ghi TODO chưa hỗ trợ nên form không nhận).
 * - defaultValue: backend DataItemCreateOrUpdateDto.Validate — khi
 *   allowBeNull=false thì defaultValue bắt buộc; theo kiểu: Number phải
 *   là số, Boolean phải là true/false, Date/DateTime phải parse được
 *   thành ngày. Array là chuỗi phân tách bằng dấu phẩy như web join(',').
 */

const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const optionalGuid = z
  .string()
  .trim()
  .refine((v) => v === '' || GUID_RE.test(v), 'platformDataDictionaries.invalidParentId')
  .optional();

const dataBaseShape = {
  name: z.string().trim().min(1, 'platformDataDictionaries.nameRequired'),
  displayName: z.string().trim().min(1, 'platformDataDictionaries.displayNameRequired'),
  description: z.string().optional(),
  parentId: optionalGuid,
};

export function dataFormSchema() {
  return z.object(dataBaseShape);
}

export type DataFormValues = z.infer<ReturnType<typeof dataFormSchema>>;

export const dataFormDefaults: DataFormValues = {
  name: '',
  displayName: '',
  description: '',
  parentId: '',
};

const valueTypeField = z
  .string()
  .trim()
  .refine((v) => /^(0|1|2|3|4|5)$/.test(v), 'platformDataItems.invalidValueType');

const itemBaseShape = {
  name: z.string().trim().min(1, 'platformDataItems.nameRequired'),
  displayName: z.string().trim().min(1, 'platformDataItems.displayNameRequired'),
  valueType: valueTypeField,
  defaultValue: z.string().optional(),
  allowBeNull: z.boolean(),
  description: z.string().optional(),
};

export function dataItemFormSchema() {
  return z.object(itemBaseShape).superRefine((values, ctx) => {
    const value = (values.defaultValue ?? '').trim();
    const type = Number(values.valueType);
    if (!values.allowBeNull && value === '') {
      ctx.addIssue({ code: 'custom', path: ['defaultValue'], message: 'platformDataItems.defaultValueRequired' });
      return;
    }
    if (value === '') return;
    if (type === 1 && Number.isNaN(Number(value))) {
      ctx.addIssue({ code: 'custom', path: ['defaultValue'], message: 'platformDataItems.defaultValueNotNumber' });
    } else if (type === 2 && value !== 'true' && value !== 'false') {
      ctx.addIssue({ code: 'custom', path: ['defaultValue'], message: 'platformDataItems.defaultValueNotBoolean' });
    } else if ((type === 3 || type === 4) && Number.isNaN(Date.parse(value))) {
      ctx.addIssue({ code: 'custom', path: ['defaultValue'], message: 'platformDataItems.defaultValueNotDate' });
    }
  });
}

export type DataItemFormValues = z.infer<ReturnType<typeof dataItemFormSchema>>;

export const dataItemFormDefaults: DataItemFormValues = {
  name: '',
  displayName: '',
  valueType: '0',
  defaultValue: '',
  allowBeNull: true,
  description: '',
};

/** Schema màn di chuyển: parentId rỗng = về gốc, nếu nhập phải đúng Guid. */
export function dataMoveFormSchema() {
  return z.object({ parentId: optionalGuid });
}

export type DataMoveFormValues = z.infer<ReturnType<typeof dataMoveFormSchema>>;

export const dataMoveFormDefaults: DataMoveFormValues = { parentId: '' };
