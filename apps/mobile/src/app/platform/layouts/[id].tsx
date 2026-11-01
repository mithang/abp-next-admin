import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteLayout, getLayout } from '../../../features/platform/platform-api';
import { toApiError } from '../../../lib/errors';

/** Chi tiết bố cục: RouteDto + framework + dataId (2 field chỉ đọc ở đây, sửa không đổi chúng). */
export default function LayoutDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['platform-layouts', id], queryFn: () => getLayout(id), enabled: Boolean(id) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteLayout(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-layouts'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('platformLayouts.name')}: {item.name}
        </Text>
        <Text>
          {t('platformLayouts.path')}: {item.path}
        </Text>
        <Text>
          {t('platformLayouts.framework')}: {item.framework}
        </Text>
        <Text>
          {t('platformLayouts.dataId')}: {item.dataId}
        </Text>
        {item.redirect ? (
          <Text>
            {t('platformLayouts.redirect')}: {item.redirect}
          </Text>
        ) : null}
        {item.description ? (
          <Text>
            {t('platformLayouts.description')}: {item.description}
          </Text>
        ) : null}
        {item.meta && Object.keys(item.meta).length > 0 ? <Text>{JSON.stringify(item.meta)}</Text> : null}
        <AppButton
          title={t('platformLayouts.editTitle')}
          onPress={() => router.push(`/platform/layouts/form?id=${encodeURIComponent(item.id)}`)}
          variant="outline"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(t('platformLayouts.deleteConfirmTitle'), t('platformLayouts.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
            ])
          }
          testID="platform-layout-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
