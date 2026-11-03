/**
 * Helper dựng href điều hướng (Expo Router) dùng chung.
 *
 * Trước vòng 67, 83 template href trong `src/app/` tự lặp 3 dạng
 * giống hệt nhau, chỉ khác base và giá trị:
 * - path segment: `` `/x/${encodeURIComponent(v)}` `` (27 điểm)
 *   và `` `/x/${v}` `` không encode (11 điểm, toàn GUID nên
 *   encode là identity, nhưng kỷ luật không đồng nhất) ->
 *   `navPath`;
 * - query string: `` `/x/form?id=${encodeURIComponent(v)}&...` ``
 *   (45 điểm) -> `navHref`.
 * Gom thành 2 hàm để một thay đổi quy tắc encode (ví dụ bỏ qua
 * giá trị rỗng) chỉ cần sửa một chỗ, và điểm gọi vẫn nói rõ
 * đang dựng path hay query — không gộp mù thành một hàm duy
 * nhất vì 2 dạng có ngữ nghĩa khác nhau (segment encode `/`
 * thành `%2F`, query encode `&`/`=` thành `%26`/`%3D`).
 *
 * Cố tình tách khỏi `apiPath` trong `api-client.ts` dù logic
 * segment giống hệt: navigation không được phụ thuộc vào module
 * API client (token, timeout, envelope) chỉ để lấy một hàm ghép
 * chuỗi; 3 dòng trùng lặp rẻ hơn một dependency sai tầng.
 *
 * Cố tình KHÔNG dùng ở đây: href tĩnh (không nội suy, không có
 * gì để encode), href từ biến đã dựng sẵn (`entry.route` ở
 * manage, `href` đã tính ở blobs sau khi 2 nhánh của nó đã qua
 * helper), và `Redirect href` tĩnh.
 */

export function navPath(base: string, ...segments: (string | number)[]): string {
  const cleanBase = base.replace(/\/+$/, '');
  if (segments.length === 0) {
    return cleanBase;
  }
  return segments.reduce<string>(
    (acc, segment) => `${acc}/${encodeURIComponent(String(segment))}`,
    cleanBase,
  );
}

export function navHref(
  path: string,
  query?: Record<string, string | number | undefined | null>,
): string {
  if (!query) {
    return path;
  }
  const parts = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  if (parts.length === 0) {
    return path;
  }
  return `${path}?${parts.join('&')}`;
}
