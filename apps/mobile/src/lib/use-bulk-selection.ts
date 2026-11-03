import { useCallback, useState } from 'react';
import { toggleSelection } from './selection';

/**
 * State chọn nhiều dùng chung cho các màn hình list có chế độ bulk
 * (cache keys, background-jobs, webhook subscriptions, send-attempts):
 * trước đây cả 4 màn hình tự lặp đúng cùng một bộ state và cùng
 * semantics — nút chọn chế độ vừa đảo `selectMode` vừa xoá lựa chọn,
 * filter settled chỉ xoá lựa chọn (giữ nguyên chế độ), bulk thành
 * công vừa xoá lựa chọn vừa thoát chế độ. Gom về một hook để 4 màn
 * không còn tự định nghĩa lại bộ ba này, và để semantics đó chỉ
 * sống ở một chỗ duy nhất.
 *
 * Cố tình KHÔNG gộp thêm thanh bulk action (nút xoá/gửi lại, confirm
 * dialog): mỗi màn có tập action, i18n key và API bulk khác nhau.
 * Cố tình KHÔNG dùng ở menu-allot: màn đó giữ selection khởi tạo từ
 * server, không có `selectMode`, semantics khác hẳn họ bulk này.
 */
export function useBulkSelection() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => toggleSelection(prev, id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  const toggleSelectMode = useCallback(() => {
    setSelectMode((v) => !v);
    setSelected(new Set());
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelected(new Set());
    setSelectMode(false);
  }, []);

  return {
    selected,
    selectMode,
    toggleSelect,
    clearSelection,
    toggleSelectMode,
    exitSelectMode,
  };
}
