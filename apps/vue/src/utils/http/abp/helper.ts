/**
 * Định dạng request phân trang phù hợp với framework abp
 * Framework abp định nghĩa phân trang như sau:
 * skipCount： Vị trí offset bắt đầu request danh sách thực thể
 * maxResultCount： Số lượng thực thể trả về trong danh sách
 */
export function formatPagedRequest(request: { skipCount: number; maxResultCount: number }) {
  if (request.skipCount > 0) {
    request.skipCount -= 1;
  }
  request.skipCount = request.skipCount * request.maxResultCount;
}
