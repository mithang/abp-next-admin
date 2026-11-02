import { useEffect, useRef, useState } from 'react';

/**
 * Trả về giá trị đã debounce của `value` (mặc định 400ms — đúng
 * khoảng trễ mọi màn hình danh sách từng tự viết bằng
 * `setTimeout(..., 400)` trước vòng 36).
 *
 * Trước vòng 36, 43 khối `useEffect` + `setTimeout` ở 42 màn hình
 * tự lặp cùng mẫu này (state debounced riêng + timer + clearTimeout),
 * chỉ khác nhau ở giá trị debounce và việc có reset page/selection
 * kèm theo hay không. Hook này gom phần timer vào một chỗ.
 *
 * `onSettled` (tuỳ chọn) chạy CÙNG callback timer với `setDebounced`,
 * nên các màn hình từng reset page/selection trong cùng timer cũ
 * vẫn giữ đúng hành vi cũ: hai setState batch thành một lần render,
 * query chỉ chạy một lần với (giá trị mới, page 0) — thay vì render
 * trung gian (giá trị mới, page cũ) rồi mới reset page. Vì vậy các
 * màn hình đó truyền reset vào `onSettled` thay vì giữ effect riêng
 * theo dõi giá trị đã debounce.
 *
 * Với object (ví dụ `{ filter, provider }`), mỗi lần render đều
 * tạo literal mới nên không thể dùng chính object làm dep của
 * effect — timer sẽ reset cả khi render do query/selection, không
 * chỉ khi field lọc đổi. Vì vậy dep của effect là
 * `JSON.stringify(value)`: timer chỉ reset khi một field thật sự
 * đổi, đúng như danh sách dep cũ `[filter, provider]` của từng
 * màn hình. Các object debounce trong app chỉ chứa string/number
 * nên serialize là đủ để phát hiện thay đổi.
 */
export function useDebouncedValue<T>(value: T, delay = 400, onSettled?: () => void): T {
  const [debounced, setDebounced] = useState(value);
  const valueRef = useRef(value);
  const onSettledRef = useRef(onSettled);
  // Ghi ref trong effect (không ghi trong render — luật react-hooks/refs):
  // effect này không có deps nên chạy mỗi lần render, và vì khai báo
  // trước effect timer nên luôn chạy trước khi timer được (lập lại).
  useEffect(() => {
    valueRef.current = value;
    onSettledRef.current = onSettled;
  });
  const key = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(valueRef.current);
      onSettledRef.current?.();
    }, delay);
    return () => clearTimeout(timer);
  }, [key, delay]);
  return debounced;
}
