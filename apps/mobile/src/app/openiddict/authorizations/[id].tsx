import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteAuthorization,
  getAuthorization,
} from '../../../features/openiddict/authorizations-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';

export default function AuthorizationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-authorizations', id],
    queryFn: () => getAuthorization(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteAuthorization(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['openiddict-authorizations'] });
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

  const authz = query.data;
  if (!authz) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={authz.subject ?? authz.id} subtitle={authz.id}>
      <VStack space="sm">
        <AppDetailField
          label={t('openiddictAuthorizations.applicationId')}
          value={authz.applicationId}
        />
        <AppDetailField label={t('openiddictAuthorizations.subject')} value={authz.subject} />
        <AppDetailField label={t('openiddictAuthorizations.type')} value={authz.type} />
        <AppDetailField label={t('openiddictAuthorizations.status')} value={authz.status} />
        <AppDetailField
          label={t('openiddictAuthorizations.scopes')}
          value={authz.scopes?.join(', ')}
        />
        <AppDetailField
          label={t('openiddictAuthorizations.creationDate')}
          value={formatDateTime(authz.creationDate)}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('openiddictAuthorizations.deleteConfirmTitle'),
              message: t('openiddictAuthorizations.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="authorization-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
