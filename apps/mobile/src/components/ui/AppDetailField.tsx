import { Text } from '@/components/ui/text';

type AppDetailFieldProps = {
  label: string;
  value?: string;
};

/**
 * Một dòng chi tiết dạng "Nhãn: giá trị" trên màn hình chi tiết.
 * Trả về null khi giá trị rỗng/undefined — đúng hành vi của 11 hàm
 * Field cục bộ trước đây ở các màn hình chi tiết (openiddict,
 * permissions, features, settings, localization). Các trường có
 * giá trị luôn hiển thị, nên màn hình không cần bọc điều kiện.
 */
export function AppDetailField({ label, value }: AppDetailFieldProps) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}
