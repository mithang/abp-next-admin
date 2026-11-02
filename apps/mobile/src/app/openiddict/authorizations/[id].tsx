import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteAuthorization,
  getAuthorization,
} from '../../../features/openiddict/authorizations-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

export default function AuthorizationDetailScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['openiddict-authorizations']);
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-authorizations', id],
    queryFn: () => getAuthorization(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteAuthorization(id),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

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
