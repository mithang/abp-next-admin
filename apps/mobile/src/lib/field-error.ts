/**
 * Dịch thông báo lỗi validation của form dùng chung cho toàn app.
 *
 * Trước vòng 46, 32 form trong `src/app` tự lặp cùng một định nghĩa
 * cục bộ: `(msg?) => msg && msg.startsWith('<prefix>.') ? t(msg) : msg`
 * (mỗi form một prefix i18n riêng: 'roles.', 'texts.', ...), cộng 1
 * chỗ inline cùng mẫu ở màn chat AI (`ai/conversations/[id].tsx`).
 * Zod schema của các form trả về message là key i18n (ví dụ
 * 'roles.nameRequired') khi lỗi thuộc namespace đó, hoặc chuỗi
 * thường khi lỗi đến từ nơi khác — nên chỉ dịch khi message bắt
 * đầu bằng `<prefix>.`, còn lại giữ nguyên.
 *
 * Cố tình KHÔNG làm hook `useFieldError`: hầu hết các định nghĩa
 * gốc nằm SAU early return (`if (isEdit && detail.isPending)
 * return <AppLoading />`), nên thay bằng hook sẽ vi phạm quy tắc
 * thứ tự hook của React. Factory thuần này nhận `t` sẵn có trong
 * scope form nên đặt ở đâu cũng an toàn, và vẫn giữ nguyên ngữ
 * nghĩa cũ từng ký tự (kể cả falsy -> passthrough).
 */
export function resolveFieldError(
  t: (key: string) => string,
  prefix: string,
  message: string,
): string;
export function resolveFieldError(
  t: (key: string) => string,
  prefix: string,
  message?: string,
): string | undefined;
export function resolveFieldError(
  t: (key: string) => string,
  prefix: string,
  message?: string,
): string | undefined {
  return message && message.startsWith(`${prefix}.`) ? t(message) : message;
}

export function createFieldError(
  t: (key: string) => string,
  prefix: string,
): (message?: string) => string | undefined {
  return (message?: string) => resolveFieldError(t, prefix, message);
}
