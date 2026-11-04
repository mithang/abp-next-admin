import { View } from 'react-native';

type AppSpacerProps = {
  height?: number;
};

/**
 * Khoảng trống dọc dùng chung giữa khối lọc và danh sách.
 * Đúng mẫu của 8 dòng `<View style={{ height: 8 }} />` đứng trước
 * AppList trong các màn danh sách (blob, container, job nền,
 * webhook, văn bản mẫu): cao mặc định 8, có thể truyền height
 * khác khi màn hình cần khoảng cách riêng. Không dùng cho khoảng
 * cách trong thẻ hay hàng nút (dùng AppSectionCard/AppButtonRow).
 */
export function AppSpacer({ height = 8 }: AppSpacerProps) {
  return <View style={{ height }} />;
}
