import { Text } from '@/components/ui/text';

type AppDetailFieldProps = {
  label: string;
  value?: string | number | null;
};

/**
 * Một dòng chi tiết dạng "Nhãn: giá trị" trên màn hình chi tiết.
 * Trả về null chỉ khi giá trị là null/undefined/chuỗi rỗng — đúng
 * hành vi của 11 hàm Field cục bộ trước đây ở các màn hình chi tiết
 * (openiddict, permissions, features, settings, localization). Giá
 * trị số 0 vẫn hiển thị (khác với kiểm tra !value cũ), nên các màn
 * hình chi tiết có thể truyền trực tiếp số lượng, trạng thái số hay
 * thời lượng mà không cần String(...) và không mất thông tin "0".
 * Kiểu value chấp nhận cả null vì nhiều DTO trả về string | null
 * (description, redirect, editionName...): null được ẩn như rỗng.
 * Các trường có giá trị luôn hiển thị, nên màn hình không cần bọc
 * điều kiện.
 */
export function AppDetailField({ label, value }: AppDetailFieldProps) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}
