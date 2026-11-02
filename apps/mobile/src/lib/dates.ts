/**
 * Format ngày giờ hiển thị dùng chung cho toàn app.
 *
 * Trước vòng 35, 34 chỗ trong `src/app` tự viết
 * `new Date(x).toLocaleString()` — rải rác, và sai với field nullable:
 * `new Date(null)` không phải Invalid Date mà là epoch 1970-01-01
 * (ví dụ blob `expirationTime?: string | null` chưa hết hạn sẽ hiển thị
 * 1970), còn `new Date('chuỗi-lỗi')` hiển thị chữ "Invalid Date".
 *
 * Helper này giữ nguyên định dạng cũ cho giá trị hợp lệ (locale của
 * thiết bị, qua `toLocaleString()` — không hardcode format, theo mục 20
 * của prompt) và trả `undefined` cho giá trị rỗng/không hợp lệ để JSX
 * không render gì, thay vì render 1970 hay "Invalid Date".
 */
export function formatDateTime(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString();
}
