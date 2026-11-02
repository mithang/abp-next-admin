import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface AppScreenProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  testID?: string;
  /**
   * Cuộn toàn bộ nội dung + đẩy nội dung lên khi mở bàn phím.
   * Dành cho màn hình form/detail (không có FlatList): trước vòng 39
   * AppScreen chỉ là VStack flex:1 nên nội dung dài hơn màn hình
   * (form nhiều field, detail dài) bị cắt ở điện thoại màn hình nhỏ
   * và bàn phím che field cuối. Màn hình danh sách KHÔNG dùng prop
   * này — FlatList của chúng đã tự cuộn, lồng thêm ScrollView sẽ
   * phá virtualization (cảnh báo VirtualizedLists lồng nhau).
   */
  scrollable?: boolean;
}

/** Khung màn hình chuẩn: safe area + tiêu đề + nội dung. */
export function AppScreen({ title, subtitle, children, testID, scrollable }: AppScreenProps) {
  const header = (
    <>
      {title ? <Heading size="xl">{title}</Heading> : null}
      {subtitle ? <Text>{subtitle}</Text> : null}
    </>
  );

  if (scrollable) {
    return (
      <SafeAreaView testID={testID} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            testID="app-screen-scroll-view"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingVertical: 16 }}
          >
            <VStack space="md">
              {header}
              {children}
            </VStack>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView testID={testID} style={{ flex: 1 }}>
      <VStack space="md" className="flex-1 px-4 py-4">
        {title ? <Heading size="xl">{title}</Heading> : null}
        {subtitle ? <Text>{subtitle}</Text> : null}
        {children}
      </VStack>
    </SafeAreaView>
  );
}
