import { DEFAULT_PAGE_SIZE } from './use-pagination';

/**
 * Giá trị phân trang mặc định cho các fetcher danh sách phía server
 * (ABP `skipCount`/`maxResultCount`).
 *
 * Trước vòng 70, 31 fetcher `*Paged` trong `src/features` tự lặp cùng
 * cặp dòng `skipCount: input.skipCount ?? 0` /
 * `maxResultCount: input.maxResultCount ?? 20` — con số 20 khi đó là
 * bản sao rời của `DEFAULT_PAGE_SIZE` ở `use-pagination.ts` (màn hình
 * dùng hook đó, API layer tự hardcode), nên đổi kích thước trang ở một
 * tầng sẽ làm hai tầng lệch nhau mà không báo lỗi nào.
 *
 * Helper này gom cặp default về một chỗ duy nhất, lấy `maxResultCount`
 * từ cùng `DEFAULT_PAGE_SIZE` mà màn hình dùng, và cố tình CHỈ trả về
 * đúng 2 field phân trang (không spread toàn bộ `input`): nhiều input
 * phân trang còn mang field chỉ dùng ở tầng khác (ví dụ field chỉ để
 * dựng path hoặc lọc phía client), spread chúng vào `params` sẽ gửi
 * thêm query param lạ lên server, đổi hành vi request.
 *
 * Cố tình KHÔNG dùng ở đây:
 * - `getChatMessagesPaged` (ai-api): `maxResultCount ?? 50` — lịch sử
 *   chat cố ý tải trang lớn hơn, không phải trang danh sách chuẩn.
 * - `getLanguagesPaged` / `getResourcesPaged` (localization-api):
 *   truyền thẳng `input.skipCount`/`input.maxResultCount` (undefined
 *   được `apiRequest` bỏ qua) nên đang dựa vào default phía server;
 *   ép về 0/20 sẽ đổi request thực tế, không được đổi lặng lẽ.
 */
export function pagedDefaults<T extends { skipCount?: number; maxResultCount?: number }>(input: T) {
  return {
    skipCount: input.skipCount ?? 0,
    maxResultCount: input.maxResultCount ?? DEFAULT_PAGE_SIZE,
  };
}
