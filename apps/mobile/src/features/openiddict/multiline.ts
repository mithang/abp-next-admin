/**
 * Chuyển đổi giữa textarea nhiều dòng (mỗi giá trị một dòng) và mảng string
 * của DTO OpenIddict (redirectUris, scopes, resources, ...).
 * Dòng trống và khoảng trắng thừa bị bỏ; thứ tự các giá trị được giữ nguyên.
 */
export function parseMultiline(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function toMultiline(values: string[] | undefined): string {
  return (values ?? []).join('\n');
}
