import type { ReactNode } from 'react';
import { View } from 'react-native';

type AppButtonRowProps = {
  children: ReactNode;
  testID?: string;
};

/**
 * Hàng nút bấm dùng chung: View ngang, gap 8.
 * Đúng mẫu của 4 hàng nút trong 3 màn hình (chọn chủ thể
 * menu-allot, sửa/xóa menu-favorites, lưu/hủy form sửa
 * menu-favorites, chọn phạm vi WeChat): các nút giữ nguyên
 * verbatim, chỉ khung View lặp lại được gộp. Không dùng cho
 * hàng icon + nhãn có alignItems center của menu-favorites
 * (ngữ nghĩa căn giữa khác, không phải hàng nút).
 */
export function AppButtonRow({ children, testID }: AppButtonRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }} testID={testID}>
      {children}
    </View>
  );
}
