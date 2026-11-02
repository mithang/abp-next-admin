import { Switch, View } from 'react-native';
import { Text } from '@/components/ui/text';

interface AppSwitchFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** 'row' (nhãn trái, switch phải) là dạng đa số; 'stack' giữ đúng dạng View trần cũ (nhãn trên, switch dưới). */
  layout?: 'row' | 'stack';
  testID?: string;
}

/**
 * Dòng bật/tắt dùng chung, thay cho khối View + Text + Switch lặp lại ở
 * ~20 màn hình form/cài đặt: luôn có accessibilityRole="switch", nhãn hiển
 * thị đúng chuỗi cũ, không đổi hành vi bật/tắt.
 */
export function AppSwitchField({
  label,
  value,
  onValueChange,
  layout = 'row',
  testID,
}: AppSwitchFieldProps) {
  if (layout === 'stack') {
    return (
      <View>
        <Text>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          accessibilityRole="switch"
          testID={testID}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityRole="switch"
        testID={testID}
      />
    </View>
  );
}
