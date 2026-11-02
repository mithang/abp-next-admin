import { z } from 'zod';

/**
 * Schema form menu, đúng DTO C#:
 * - Tạo/sửa chung: name/displayName/path/component bắt buộc,
 *   parentId Guid tùy chọn (để trống = gốc; nút "Tạo con" preset
 *   parentId như drawer web), isPublic Switch, meta JSON text
 *   (mặc định {}; drawer web xây form meta động từ từ điển ràng
 *   buộc của layout — mobile chưa có form động nên nhập JSON và
 *   kiểm chứng JSON hợp lệ, đúng dữ liệu gửi lên backend).
 * - Tạo: layoutId Guid bắt buộc (MenuCreateDto, ApiSelect layout ở
 *   bảng web). Sửa: ẩn layoutId, hiển thị chỉ đọc, không gửi
 *   (MenuUpdateDto không có layoutId — giống bố cục).
 * - Sửa: chặn chọn chính menu đang sửa làm cha của nó ở client
 *   (form nhận selfId để chặn; backend không có validate này).
 */

const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const optionalGuid = z
  .string()
  .trim()
  .refine((v) => v === '' || GUID_RE.test(v), 'platformMenus.invalidGuid')
  .optional();

const metaJson = z
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
  }, 'platformMenus.invalidMetaJson')
  .optional();

export function menuFormSchema(isEdit: boolean, selfId?: string) {
  const base = z.object({
    name: z.string().trim().min(1, 'platformMenus.nameRequired'),
    displayName: z.string().trim().min(1, 'platformMenus.displayNameRequired'),
    path: z.string().trim().min(1, 'platformMenus.pathRequired'),
    component: z.string().trim().min(1, 'platformMenus.componentRequired'),
    redirect: z.string().optional(),
    description: z.string().optional(),
    parentId: optionalGuid,
    isPublic: z.boolean(),
    meta: metaJson,
    layoutId: z.string().optional(),
  });
  return base.superRefine((values, ctx) => {
    if (!isEdit) {
      const layoutId = (values.layoutId ?? '').trim();
      if (layoutId === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['layoutId'],
          message: 'platformMenus.layoutIdRequired',
        });
      } else if (!GUID_RE.test(layoutId)) {
        ctx.addIssue({ code: 'custom', path: ['layoutId'], message: 'platformMenus.invalidGuid' });
      }
    }
    if (isEdit && selfId && (values.parentId ?? '').trim() === selfId) {
      ctx.addIssue({
        code: 'custom',
        path: ['parentId'],
        message: 'platformMenus.selfParentForbidden',
      });
    }
  });
}

export type MenuFormValues = {
  name: string;
  displayName: string;
  path: string;
  component: string;
  redirect?: string;
  description?: string;
  parentId?: string;
  isPublic: boolean;
  meta?: string;
  layoutId?: string;
};

export const menuFormDefaults: MenuFormValues = {
  name: '',
  displayName: '',
  path: '',
  component: '',
  redirect: '',
  description: '',
  parentId: '',
  isPublic: false,
  meta: '',
  layoutId: '',
};
