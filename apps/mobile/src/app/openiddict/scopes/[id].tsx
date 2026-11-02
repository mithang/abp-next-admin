import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteScope, getScope } from '../../../features/openiddict/scopes-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

export default function ScopeDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-scopes', id],
    queryFn: () => getScope(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteScope(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['openiddict-scopes'] });
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

  const scope = query.data;
  if (!scope) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={scope.displayName || scope.name} subtitle={scope.id}>
      <VStack space="sm">
        <AppDetailField label={t('openiddictScopes.name')} value={scope.name} />
        <AppDetailField label={t('openiddictScopes.displayName')} value={scope.displayName} />
        <AppDetailField label={t('openiddictScopes.description')} value={scope.description} />
        <AppDetailField
          label={t('openiddictScopes.resources')}
          value={scope.resources?.join(', ')}
        />
        <AppButton
          title={t('openiddictScopes.editTitle')}
          onPress={() => router.push(`/openiddict/scopes/form?id=${encodeURIComponent(scope.id)}`)}
          variant="outline"
          testID="scope-edit"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('openiddictScopes.deleteConfirmTitle'),
              message: t('openiddictScopes.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="scope-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
