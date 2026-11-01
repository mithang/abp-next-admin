import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteResource, getResource } from '../../../features/localization/localization-api';
import { toApiError } from '../../../lib/errors';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

/** Chi tiết tài nguyên: khóa là name; web không có khái niệm tĩnh ở đây nên luôn có Sửa/Xóa. */
export default function ResourceDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({ queryKey: ['resources', name], queryFn: () => getResource(name), enabled: Boolean(name) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteResource(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['resources'] });
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
    <AppScreen title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <Field label={t('resources.name')} value={item.name} />
        <Field label={t('resources.displayName')} value={item.displayName} />
        <Field label={t('resources.description')} value={item.description} />
        <Field label={t('resources.defaultCultureName')} value={item.defaultCultureName} />
        <Text>
          {t('resources.enable')}: {item.enable ? t('resources.enabled') : t('resources.disabled')}
        </Text>
        <Field label={t('resources.creationTime')} value={item.creationTime} />
        <AppButton
          title={t('resources.editTitle')}
          onPress={() => router.push(`/localization/resources/form?name=${encodeURIComponent(item.name)}`)}
          variant="outline"
          testID="resource-edit"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(t('resources.deleteConfirmTitle'), t('resources.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
            ])
          }
          testID="resource-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
