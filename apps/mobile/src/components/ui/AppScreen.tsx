import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface AppScreenProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  testID?: string;
}

/** Khung màn hình chuẩn: safe area + tiêu đề + nội dung. */
export function AppScreen({ title, subtitle, children, testID }: AppScreenProps) {
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
