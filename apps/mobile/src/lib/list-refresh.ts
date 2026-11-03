/**
 * Props pull-to-refresh dùng chung cho các FlatList danh sách.
 *
 * Trước vòng 55, 48 màn hình tự lặp đúng cùng cặp props trên FlatList:
 * `refreshing={query.isFetching}` và `onRefresh={() => void query.refetch()}`
 * (tên biến query thay bằng listQuery/history ở 3 màn hình). Helper thuần
 * này gom cặp đó thành một lần gọi `{...listRefreshProps(query)}` nên một
 * thay đổi quy tắc refresh (ví dụ đổi isFetching thành isRefetching) chỉ
 * cần sửa một chỗ. Cố tình là hàm thuần, không phải hook: nó không dùng
 * state/effect nào, và gọi inline tại props giúp tránh phải chèn thêm
 * câu lệnh hook vào 48 file ở vị trí khai báo query.
 *
 * Cố tình KHÔNG dùng ở đây: màn hình cache — onRefresh của nó còn xóa
 * các khóa/marker đã tải thêm trước khi refetch, nếu không danh sách sẽ
 * trùng khóa trang đầu (xem comment tại chỗ trong cache/caches.tsx).
 */
export type RefreshableQuery = {
  isFetching: boolean;
  refetch: () => unknown;
};

export function listRefreshProps(query: RefreshableQuery) {
  return {
    refreshing: query.isFetching,
    onRefresh: () => {
      void query.refetch();
    },
  };
}
