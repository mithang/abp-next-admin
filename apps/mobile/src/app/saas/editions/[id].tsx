import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteEdition, getEdition } from '../../../features/saas/saas-api';
import { toApiError } from '../../../lib/errors';

/** Chi tiết phiên bản: DTO chỉ có displayName (+ audit/extraProperties). */
export default function EditionDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['saas-editions', id],
    queryFn: () => getEdition(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteEdition(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['saas-editions'] });
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
    <AppScreen title={item.displayName}>
      <VStack space="sm">
        {item.creationTime ? (
          <Text>
            {t('saasEditions.creationTime')}: {item.creationTime}
          </Text>
        ) : null}
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <Text>
            {t('saasEditions.extraProperties')}: {JSON.stringify(item.extraProperties)}
          </Text>
        ) : null}
        <AppButton
          title={t('saasEditions.editTitle')}
          onPress={() => router.push(`/saas/editions/form?id=${encodeURIComponent(item.id)}`)}
          variant="outline"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(
              t('saasEditions.deleteConfirmTitle'),
              t('saasEditions.deleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteMutation.mutate(),
                },
              ],
            )
          }
          testID="saas-edition-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
