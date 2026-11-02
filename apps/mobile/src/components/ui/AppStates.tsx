import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { AppButton } from './AppButton';

export function AppLoading({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <VStack space="md" className="flex-1 items-center justify-center py-8">
      <ActivityIndicator />
      <Text>{label ?? t('common.loading')}</Text>
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
  const { t } = useTranslation();
  return (
    <VStack space="md" className="flex-1 items-center justify-center py-8">
      <Text className="text-center text-destructive">{message}</Text>
      {onRetry ? <AppButton title={t('common.retry')} onPress={onRetry} variant="outline" /> : null}
    </VStack>
  );
}
