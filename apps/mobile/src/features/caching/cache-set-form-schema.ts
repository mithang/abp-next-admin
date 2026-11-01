import { z } from 'zod';

/**
 * Schema form đặt giá trị cache: key bắt buộc (web: CacheSetInput.Key
 * [Required]); value là chuỗi tùy chọn. Hạn tuyệt đối / hạn trượt nhập dạng
 * text ISO (vd 2026-11-02T10:00:00) vì mobile chưa có date-picker cho 2
 * field này — chuỗi rỗng nghĩa là không đặt hạn; chuỗi không parse được
 * thành ngày thì báo lỗi thay vì gửi rác lên backend. Việc đổi chuỗi sang
 * ISO thực hiện ở lúc submit (theo mẫu các form vòng trước), không dùng
 * zod transform để khỏi lệch kiểu input/output với RHF.
 */
const optionalIsoDateTime = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Date.parse(v)), 'caches.invalidDateTime')
  .optional();

export const cacheSetFormSchema = z.object({
  key: z.string().trim().min(1, 'caches.keyRequired').max(1024, 'caches.keyTooLong'),
  value: z.string().max(65536, 'caches.valueTooLong').optional(),
  absoluteExpiration: optionalIsoDateTime,
  slidingExpiration: optionalIsoDateTime,
});

export type CacheSetFormValues = z.infer<typeof cacheSetFormSchema>;

export const cacheSetFormDefaults: CacheSetFormValues = {
  key: '',
  value: '',
  absoluteExpiration: '',
  slidingExpiration: '',
};

/** Đổi chuỗi hạn rỗng thành undefined, còn lại sang ISO cho CacheSetInput. */
export function toCacheSetExpirations(values: CacheSetFormValues) {
  const toIso = (v?: string) => {
    const trimmed = (v ?? '').trim();
    return trimmed === '' ? undefined : new Date(trimmed).toISOString();
  };
  return {
    absoluteExpiration: toIso(values.absoluteExpiration),
    slidingExpiration: toIso(values.slidingExpiration),
  };
}
