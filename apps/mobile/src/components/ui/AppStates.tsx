import { ActivityIndicator } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { AppButton } from './AppButton';

export function AppLoading({ label = 'Đang tải…' }: { label?: string }) {
  return (
    <VStack space="md" className="flex-1 items-center justify-center py-8">
      <ActivityIndicator />
      <Text>{label}</Text>
    </VStack>
  );
}

export function AppEmptyState({ message }: { message: string }) {
  return (
    <VStack space="md" className="flex-1 items-center justify-center py-8">
      <Text className="text-center">{message}</Text>
    </VStack>
  );
}

export function AppErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <VStack space="md" className="flex-1 items-center justify-center py-8">
      <Text className="text-center text-destructive">{message}</Text>
      {onRetry ? <AppButton title="Thử lại" onPress={onRetry} variant="outline" /> : null}
    </VStack>
  );
}
