import { z } from 'zod';

/**
 * Schema form tenant, đúng DTO C#:
 * - Tạo: name bắt buộc; adminEmailAddress/adminPassword bắt buộc (chỉ có
 *   ở TenantCreateDto, form sửa ẩn 2 field này); useSharedDatabase=true
 *   mặc định; khi KHÔNG dùng DB chung thì defaultConnectionString bắt buộc
 *   (đúng TenantCreateDto.Validate của backend).
 * - Sửa: không đổi admin fields, gửi kèm concurrencyStamp lấy từ detail
 *   (UpdateDto bắt buộc); name vẫn gửi (UpdateDto có name, khác AI tools).
 * - editionId: để trống = không gán phiên bản; nếu nhập phải đúng dạng Guid
 *   (backend parse Guid, Guid sai sẽ 400 — chặn ở schema thay vì gửi rác).
 * - enableTime/disableTime: nhập text ISO (chưa có date-picker, như các
 *   vòng trước); phải parse được thành ngày giờ và enableTime không được
 *   muộn hơn disableTime (đúng luật disable của DatePicker web).
 * - extraProperties: JSON object, chuỗi rỗng = không có.
 */

const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const optionalGuid = z
  .string()
  .trim()
  .refine((v) => v === '' || GUID_RE.test(v), 'saasTenants.invalidEditionId')
  .optional();

const optionalDateTime = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Date.parse(v)), 'saasTenants.invalidDateTime')
  .optional();

const optionalJsonObject = z
  .string()
  .trim()
  .refine((v) => {
    if (v === '') return true;
    try {
      const parsed: unknown = JSON.parse(v);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, 'saasTenants.invalidExtraPropertiesJson')
  .optional();

const baseShape = {
  name: z.string().trim().min(1, 'saasTenants.nameRequired').max(256, 'saasTenants.nameTooLong'),
  isActive: z.boolean(),
  editionId: optionalGuid,
  enableTime: optionalDateTime,
  disableTime: optionalDateTime,
  adminEmailAddress: z.string().trim().optional(),
  adminPassword: z.string().optional(),
  useSharedDatabase: z.boolean(),
  defaultConnectionString: z.string().optional(),
  extraPropertiesJson: optionalJsonObject,
};

/** isCreate=true: bật các ràng buộc chỉ có lúc tạo (admin fields, DB riêng). */
export function tenantFormSchema(isCreate: boolean) {
  return z
    .object(baseShape)
    .superRefine((values, ctx) => {
      const enable = (values.enableTime ?? '').trim();
      const disable = (values.disableTime ?? '').trim();
      if (enable !== '' && disable !== '' && Date.parse(enable) > Date.parse(disable)) {
        ctx.addIssue({ code: 'custom', path: ['disableTime'], message: 'saasTenants.enableAfterDisable' });
      }
      if (!isCreate) return;
      const email = (values.adminEmailAddress ?? '').trim();
      if (email === '') {
        ctx.addIssue({ code: 'custom', path: ['adminEmailAddress'], message: 'saasTenants.adminEmailRequired' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ctx.addIssue({ code: 'custom', path: ['adminEmailAddress'], message: 'saasTenants.invalidEmail' });
      }
      const password = values.adminPassword ?? '';
      if (password === '') {
        ctx.addIssue({ code: 'custom', path: ['adminPassword'], message: 'saasTenants.adminPasswordRequired' });
      } else if (password.length > 128) {
        ctx.addIssue({ code: 'custom', path: ['adminPassword'], message: 'saasTenants.adminPasswordTooLong' });
      }
      if (!values.useSharedDatabase && (values.defaultConnectionString ?? '').trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['defaultConnectionString'],
          message: 'saasTenants.defaultConnectionStringRequired',
        });
      }
    });
}

export type TenantFormValues = z.infer<ReturnType<typeof tenantFormSchema>>;

export const tenantFormDefaults: TenantFormValues = {
  name: '',
  isActive: true,
  editionId: '',
  enableTime: '',
  disableTime: '',
  adminEmailAddress: '',
  adminPassword: '',
  useSharedDatabase: true,
  defaultConnectionString: '',
  extraPropertiesJson: '',
};

/** Đổi extraPropertiesJson rỗng → undefined, còn lại parse thành object. */
export function parseExtraPropertiesJson(values: TenantFormValues): Record<string, unknown> | undefined {
  const trimmed = (values.extraPropertiesJson ?? '').trim();
  if (trimmed === '') return undefined;
  return JSON.parse(trimmed) as Record<string, unknown>;
}
