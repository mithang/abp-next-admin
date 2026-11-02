import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

export interface AppSelectOption {
  value: string;
  label: string;
  /** Độ sâu trong cây (0 = gốc); dùng để thụt lề khi option từ cây parentId. */
  depth?: number;
  disabled?: boolean;
}

interface AppSelectProps {
  label?: string;
  /** Giá trị đang chọn; '' hoặc null = chưa chọn. */
  value: string | null | undefined;
  options: AppSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** Cho phép tìm trong danh sách khi mở (mặc định true). */
  searchable?: boolean;
  /** Hiện nút xóa để về "chưa chọn" (dùng cho field tùy chọn như parentId). */
  clearable?: boolean;
  testID?: string;
}

/**
 * Select chuẩn dùng chung, thay cho nhập Guid/name bằng text kèm gợi ý
 * (mẫu cũ ở form bố cục/menu trước vòng 28): bấm field → danh sách mở
 * ngay dưới field, có tìm kiếm, chọn 1 option → đóng và trả value.
 *
 * Cố tình KHÔNG dùng Gluestack Select và KHÔNG dùng AppInput ở đây:
 * - Vendored Gluestack chưa có component select; cài thêm package select
 *   là dependency mới chỉ để giải quyết 1 control (trái quy tắc §4.1).
 * - AppInput kéo theo vendored Gluestack Input qua react-native-css và
 *   crash ở import dưới Jest (vòng 27, BLOCKED ở tầng tooling test) —
 *   ô tìm kiếm dùng TextInput thuần của React Native nên test được.
 * Danh sách mở inline (không dùng RN Modal) để RNTL bấm option trực
 * tiếp và để field nằm trong ScrollView của form mà không bị portal
 * che; danh sách giới hạn chiều cao và tự scroll trong.
 */
export function AppSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
  disabled,
  searchable = true,
  clearable = false,
  testID,
}: AppSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = options.find((o) => o.value === value);
  // Preset từ query param (VD: ?layoutId=) có thể nằm ngoài trang gợi
  // ý đã tải: vẫn hiển thị đúng value thay vì trống, để user không
  // tưởng field chưa chọn.
  const displayText = selected?.label ?? value ?? '';
  const hasValue = Boolean(value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  const toggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    setQuery('');
  };

  return (
    <VStack space="xs">
      {label ? <Text>{label}</Text> : null}
      <Pressable
        onPress={toggle}
        disabled={disabled}
        testID={testID ? `${testID}-field` : undefined}
        accessibilityRole="button"
        style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.7 : 1 })}
      >
        <View className="flex-row items-center justify-between rounded-xl border border-outline-300 px-3 py-3">
          <Text className={displayText ? '' : 'text-typography-400'}>
            {displayText || placeholder || t('appSelect.select')}
          </Text>
          <Text>{open ? '▴' : '▾'}</Text>
        </View>
      </Pressable>
      {clearable && hasValue && !disabled ? (
        <Pressable
          onPress={() => onChange('')}
          testID={testID ? `${testID}-clear` : undefined}
          accessibilityRole="button"
        >
          <Text>{t('appSelect.clear')}</Text>
        </Pressable>
      ) : null}
      {error ? <Text className="text-destructive">{error}</Text> : null}
      {open && !disabled ? (
        <View className="rounded-xl border border-outline-300">
          {searchable ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('appSelect.search')}
              autoCapitalize="none"
              testID={testID ? `${testID}-search` : undefined}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            />
          ) : null}
          <ScrollView style={{ maxHeight: 240 }}>
            {filtered.length === 0 ? (
              <Text className="px-3 py-3">{t('appSelect.empty')}</Text>
            ) : (
              filtered.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      if (option.disabled) return;
                      onChange(option.value);
                      setOpen(false);
                      setQuery('');
                    }}
                    disabled={option.disabled}
                    testID={testID ? `${testID}-option-${option.value}` : undefined}
                    accessibilityRole="button"
                    style={{ opacity: option.disabled ? 0.5 : 1 }}
                  >
                    <Text
                      style={{ paddingLeft: 12 + (option.depth ?? 0) * 16 }}
                      className="py-3 pr-3"
                    >
                      {isSelected ? '✓ ' : ''}
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      ) : null}
    </VStack>
  );
}
