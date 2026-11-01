import { z } from 'zod';

/**
 * Schema form bố cục, đúng DTO C#:
 * - Tạo: name/displayName/path bắt buộc, redirect/description tùy chọn,
 *   dataId Guid bắt buộc + framework bắt buộc (chỉ có ở LayoutCreateDto;
 *   modal web ẩn 2 field này khi sửa).
 * - Sửa: không gửi dataId/framework (LayoutUpdateDto không có) — màn
 *   sửa ẩn 2 field, hiển thị giá trị hiện tại dạng chỉ đọc.
 * - Framework web lấy từ ApiSelect: từ điển tên 'UI Framework', value là
 *   name của mục; mobile nhập text kèm gợi ý tên mục (chưa có AppSelect,
 *   theo mẫu gợi ý của các vòng trước).
 * - dataId web lấy từ ApiTreeSelect: cây từ điển; mobile nhập Guid kèm
 *   gợi ý "tên hiển thị — id" từ GET /api/platform/datas/all.
 */

const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const baseShape = {
  name: z.string().trim().min(1, 'platformLayouts.nameRequired'),
  displayName: z.string().trim().min(1, 'platformLayouts.displayNameRequired'),
  path: z.string().trim().min(1, 'platformLayouts.pathRequired'),
  redirect: z.string().optional(),
  description: z.string().optional(),
  dataId: z
    .string()
    .trim()
    .refine((v) => v === '' || GUID_RE.test(v), 'platformLayouts.invalidDataId')
    .optional(),
  framework: z.string().trim().optional(),
};

/** isCreate=true: bật ràng buộc chỉ có lúc tạo (dataId + framework bắt buộc). */
export function layoutFormSchema(isCreate: boolean) {
  return z.object(baseShape).superRefine((values, ctx) => {
    if (!isCreate) return;
    if ((values.dataId ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['dataId'], message: 'platformLayouts.dataIdRequired' });
    }
    if ((values.framework ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['framework'], message: 'platformLayouts.frameworkRequired' });
    }
  });
}

export type LayoutFormValues = z.infer<ReturnType<typeof layoutFormSchema>>;

export const layoutFormDefaults: LayoutFormValues = {
  name: '',
  displayName: '',
  path: '',
  redirect: '',
  description: '',
  dataId: '',
  framework: '',
};
