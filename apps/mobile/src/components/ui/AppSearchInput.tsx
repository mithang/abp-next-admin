import { AppInput } from './AppInput';

interface AppSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  testID?: string;
}

/**
 * Ô tìm kiếm dùng chung cho các màn hình danh sách: đúng mẫu AppInput
 * lặp lại ở ~40 màn hình (value + onChangeText + placeholder tìm kiếm +
 * autoCapitalize "none" + testID), không nhãn, không lỗi theo field.
 * autoCapitalize được cố định "none" để chuỗi tìm kiếm không bị viết
 * hoa chữ đầu trên bàn phím di động.
 */
export function AppSearchInput({ value, onChangeText, placeholder, testID }: AppSearchInputProps) {
  return (
    <AppInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize="none"
      testID={testID}
    />
  );
}
