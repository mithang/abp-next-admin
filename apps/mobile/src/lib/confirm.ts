import { Alert } from 'react-native';

/**
 * Hộp thoại xác nhận 2 nút dùng chung toàn app (vòng 34): nút Hủy
 * (style 'cancel') + nút xác nhận (mặc định style 'destructive').
 * Trước vòng này 54 chỗ tự viết Alert.alert với cùng một khuôn mẫu
 * (hủy + xác nhận destructive, chỉ khác chuỗi và onPress); helper này
 * giữ nguyên hành vi (thứ tự nút, style, onPress) nhưng chỉ còn một
 * chỗ định nghĩa khuôn mẫu. Các chuỗi đã dịch sẵn được truyền vào
 * (title/message/confirmText/cancelText) — helper không tự gọi t()
 * vì tầng lib không có hook i18n. Hai chỗ gửi lại SMS/Email truyền
 * destructive: false vì bản gốc không đặt style cho nút gửi (mặc
 * định 'default', không phải destructive).
 */
export type ConfirmDialogOptions = {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  /** false = nút xác nhận không destructive. Mặc định true. */
  destructive?: boolean;
};

export function showConfirmDialog(options: ConfirmDialogOptions): void {
  Alert.alert(options.title, options.message, [
    { text: options.cancelText, style: 'cancel' },
    {
      text: options.confirmText,
      style: options.destructive === false ? 'default' : 'destructive',
      onPress: options.onConfirm,
    },
  ]);
}
