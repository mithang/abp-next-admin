import { Text } from '@/components/ui/text';

type AppOptionalTextProps = {
  /** Chuỗi hiển thị; null/undefined/chuỗi rỗng luôn ẩn (kể cả khi show=true). */
  value?: string | null;
  /**
   * Điều kiện hiển thị riêng, dùng khi chuỗi hiển thị không tự nó
   * quyết định được (nhãn cờ isStatic/isSystem, thông báo lưu,
   * trạng thái đang tải...). Mặc định = Boolean(value), tức đúng
   * ngữ nghĩa ternary cũ `{value ? <Text>{value}</Text> : null}`.
   */
  show?: boolean;
};

/**
 * Một dòng Text có điều kiện dùng chung cho các màn danh sách,
 * chi tiết và form: hiển thị `<Text>{value}</Text>` chỉ khi dòng
 * đó có nội dung, còn lại trả về null. Gộp đúng mẫu ternary
 * `{cond ? <Text>{content}</Text> : null}` lặp lại ở 68 điểm
 * trong 46 màn (mô tả tùy chọn, ngày đã format, nhãn cờ
 * "· static", thông báo lưu/thành công, dòng lỗi chuỗi...).
 * Khác AppDetailField (dạng "Nhãn: giá trị" cho màn chi tiết)
 * và khác stateErrorElement (chỉ đặt tên cho dòng lỗi): đây là
 * dòng text trần không nhãn, dùng ở cả hàng danh sách lẫn form.
 * Trường hợp suy biến duy nhất khác ternary cũ: value là chuỗi
 * ngày không hợp lệ qua formatDateTime (trả về undefined) thì
 * nay ẩn hẳn thay vì vẽ một Text rỗng — hiển thị y hệt.
 */
export function AppOptionalText({ value, show }: AppOptionalTextProps) {
  const visible = show ?? Boolean(value);
  if (!visible || value === undefined || value === null || value === '') return null;
  return <Text>{value}</Text>;
}
