import { z } from 'zod';

/**
 * Schema form tác vụ nền, đúng DTO C#:
 * - Các số nhập dạng text rồi parse (mẫu notification/ai): jobType chỉ
 *   nhận 0/1/2, priority chỉ nhận 5/10/15/20/25; interval/maxCount/
 *   maxTryCount/lockTimeOut phải là số nguyên >= 0.
 * - Thời gian nhập text ISO (YYYY-MM-DD hoặc ISO đầy đủ); beginTime
 *   bắt buộc khi tạo (CreateDto [Required]), endTime tùy chọn.
 * - Args: JSON object text (mặc định {}), đúng ExtraPropertyDictionary
 *   của backend; mảng/chuỗi thô bị chặn như meta menu.
 * - Sửa: schema chung nhưng màn sửa ẩn các field chỉ có ở CreateDto
 *   (name/group/type/nodeName/beginTime/endTime/source) và không gửi
 *   chúng — UpdateDto chỉ có base + concurrencyStamp; superRefine chỉ
 *   bắt các field tạo khi !isEdit.
 */

const intNumber = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0, message);

const argsJson = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (v === '') return true;
      try {
        const parsed: unknown = JSON.parse(v);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
      } catch {
        return false;
      }
    },
    'backgroundJobs.invalidArgsJson',
  )
  .optional();

const isoDateTime = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || !Number.isNaN(Date.parse(v)), message);

export function backgroundJobFormSchema(isEdit: boolean) {
  const base = z.object({
    name: z.string().optional(),
    group: z.string().optional(),
    type: z.string().optional(),
    nodeName: z.string().optional(),
    beginTime: z.string().optional(),
    endTime: isoDateTime('backgroundJobs.invalidDateTime'),
    isEnabled: z.boolean(),
    description: z.string().optional(),
    jobType: z
      .string()
      .trim()
      .refine((v) => v === '' || ['0', '1', '2'].includes(v), 'backgroundJobs.invalidJobType'),
    cron: z.string().optional(),
    maxTryCount: intNumber('backgroundJobs.invalidNumber'),
    maxCount: intNumber('backgroundJobs.invalidNumber'),
    interval: intNumber('backgroundJobs.invalidNumber'),
    priority: z
      .string()
      .trim()
      .refine((v) => v === '' || ['5', '10', '15', '20', '25'].includes(v), 'backgroundJobs.invalidPriority'),
    lockTimeOut: intNumber('backgroundJobs.invalidNumber'),
    args: argsJson,
  });
  return base.superRefine((values, ctx) => {
    if (isEdit) return;
    if ((values.name ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['name'], message: 'backgroundJobs.nameRequired' });
    }
    if ((values.group ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['group'], message: 'backgroundJobs.groupRequired' });
    }
    if ((values.type ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['type'], message: 'backgroundJobs.typeRequired' });
    }
    if ((values.beginTime ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['beginTime'], message: 'backgroundJobs.beginTimeRequired' });
    } else if (Number.isNaN(Date.parse(values.beginTime as string))) {
      ctx.addIssue({ code: 'custom', path: ['beginTime'], message: 'backgroundJobs.invalidDateTime' });
    }
    if ((values.jobType ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['jobType'], message: 'backgroundJobs.jobTypeRequired' });
    }
    if ((values.priority ?? '').trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['priority'], message: 'backgroundJobs.priorityRequired' });
    }
  });
}

/**
 * Kiểu giá trị form suy ra trực tiếp từ schema (mẫu menu-form: kiểu
 * thủ công lệch với output của superRefine sẽ làm zodResolver lỗi
 * kiểu; infer giữ resolver và useForm khớp nhau chính xác).
 */
export type BackgroundJobFormValues = z.infer<ReturnType<typeof backgroundJobFormSchema>>;

export const backgroundJobFormDefaults: BackgroundJobFormValues = {
  name: '',
  group: '',
  type: '',
  nodeName: '',
  beginTime: '',
  endTime: '',
  isEnabled: true,
  description: '',
  jobType: '',
  cron: '',
  maxTryCount: '50',
  maxCount: '0',
  interval: '300',
  priority: '15',
  lockTimeOut: '0',
  args: '{}',
};

/** Chuyển giá trị form thành base DTO (dùng chung tạo/sửa). */
export function backgroundJobBaseFromForm(values: BackgroundJobFormValues) {
  return {
    isEnabled: values.isEnabled,
    args: values.args && values.args.trim() !== '' ? (JSON.parse(values.args) as Record<string, unknown>) : {},
    description: values.description?.trim() || undefined,
    jobType: Number(values.jobType),
    cron: values.cron?.trim() || undefined,
    maxTryCount: Number(values.maxTryCount),
    maxCount: Number(values.maxCount),
    interval: Number(values.interval),
    priority: Number(values.priority),
    lockTimeOut: Number(values.lockTimeOut),
  };
}
