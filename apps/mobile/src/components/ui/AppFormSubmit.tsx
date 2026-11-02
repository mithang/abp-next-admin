import { Text } from '@/components/ui/text';
import { AppButton } from './AppButton';

interface AppFormSubmitProps {
  /** Lỗi submit của form (chuỗi đã dịch/hiển thị); null/undefined thì không render dòng lỗi. */
  error?: string | null;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

/**
 * Chân form chuẩn: dòng lỗi submit (nếu có) + nút submit.
 * Gộp cặp lặp lại ở mọi form: `{submitError ? <Text>{submitError}</Text> : null}`
 * ngay trước `<AppButton ... />`. Thứ tự giữ nguyên: lỗi trên, nút dưới.
 */
export function AppFormSubmit({
  error,
  title,
  loading,
  disabled,
  onPress,
  testID,
}: AppFormSubmitProps) {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      <AppButton
        title={title}
        loading={loading}
        disabled={disabled}
        onPress={onPress}
        testID={testID}
      />
    </>
  );
}
