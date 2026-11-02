import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteLanguage, getLanguage } from '../../../features/localization/localization-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

/** Chi tiết ngôn ngữ: khóa là cultureName; web không có khái niệm tĩnh ở đây nên luôn có Sửa/Xóa. */
export default function LanguageDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['languages', name],
    queryFn: () => getLanguage(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteLanguage(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['languages'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.cultureName} subtitle={item.cultureName}>
      <VStack space="sm">
        <Field label={t('languages.cultureName')} value={item.cultureName} />
        <Field label={t('languages.uiCultureName')} value={item.uiCultureName} />
        <Field label={t('languages.displayName')} value={item.displayName} />
        <Field label={t('languages.twoLetter')} value={item.twoLetterISOLanguageName} />
        <Field label={t('languages.creationTime')} value={item.creationTime} />
        <AppButton
          title={t('languages.editTitle')}
          onPress={() =>
            router.push(`/localization/languages/form?name=${encodeURIComponent(item.cultureName)}`)
          }
          variant="outline"
          testID="language-edit"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('languages.deleteConfirmTitle'),
              message: t('languages.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="language-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
