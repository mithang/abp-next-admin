/**
 * Key extractor dùng chung cho FlatList.
 *
 * Trước vòng 61, 43 FlatList trong app tự lặp 4 dạng keyExtractor
 * giống hệt nhau, chỉ khác trường làm key:
 * - `(item) => item.id` (25 điểm) và `(item) => String(item.id)` (2 điểm,
 *   id dạng số ở my-notifilers và send-records) -> `keyById`;
 * - `(item) => item.name` (12 điểm) -> `keyByName`;
 * - `({ item }) => item.id` (4 danh sách cây, phần tử FlatList là
 *   wrapper { item, depth } nên key là id của phần tử lồng bên trong)
 *   -> `keyByNestedId`.
 * Gom thành 3 hàm đặt tên theo đúng ngữ nghĩa để một thay đổi quy tắc
 * key (ví dụ chuẩn hóa key số) chỉ cần sửa một chỗ, và tên hàm tại
 * điểm gọi vẫn nói rõ key lấy từ trường nào — không gộp mù thành
 * một hàm duy nhất.
 *
 * Cố tình KHÔNG dùng ở đây (11 điểm còn lại, mỗi dạng chỉ 1-3 điểm
 * nên ép vào helper sẽ làm mờ ngữ nghĩa): `item.unit.id`,
 * `item.sessionId`, `row.key` (3 màn hình), `item.cultureName`,
 * `` `${item.resourceName}:${item.key}` ``, key dự phòng
 * `item.fields?.id ?? timestamp-index`, `item` (phần tử đã là chuỗi),
 * và `item.key` (2 màn hình).
 */

export function keyById<T extends { id: string | number }>(item: T): string {
  return String(item.id);
}

export function keyByName<T extends { name: string }>(item: T): string {
  return item.name;
}

export function keyByNestedId<T extends { item: { id: string | number } }>(wrapper: T): string {
  return String(wrapper.item.id);
}
