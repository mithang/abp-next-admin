import { useQuery } from '@tanstack/react-query';

/**
 * Query chi tiết dùng chung cho các màn hình detail/form: key luôn là
 * [entity, param], fetcher chỉ được gọi khi param có giá trị.
 * Trước đây 71 điểm trong `src/app` tự lặp đúng 3 field này
 * (`queryKey`, `queryFn`, `enabled`), trong đó các form còn phải cast
 * `id as string` / `name as string` ở từng call site vì param kiểu
 * `string | undefined` nhưng fetcher nhận `string`. Helper gom cast đó
 * về một chỗ duy nhất, và cast chỉ an toàn vì `enabled: Boolean(param)`
 * đảm bảo TanStack Query không gọi `queryFn` khi param rỗng — không
 * một call site nào còn phải tự chứng minh điều đó nữa.
 * Cố tình KHÔNG nhận thêm option (staleTime, select...): mọi block gốc
 * đều chỉ có đúng 3 field, query nào cần option khác hoặc key nhiều
 * đoạn (menu-allot, cache, text-template content...) vẫn dùng
 * `useQuery` trực tiếp.
 */
export function useDetailQuery<T>(
  key: string,
  param: string | undefined,
  fetcher: (param: string) => Promise<T>,
) {
  return useQuery({
    queryKey: [key, param],
    queryFn: () => fetcher(param as string),
    enabled: Boolean(param),
  });
}
