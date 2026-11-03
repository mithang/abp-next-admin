import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import {
  deleteAuthorization,
  getAuthorization,
} from '../../../features/openiddict/authorizations-api';
import { formatDateTime } from '../../../lib/dates';

export default function AuthorizationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-authorizations', id],
    queryFn: () => getAuthorization(id),
    enabled: Boolean(id),
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
        <AppDeleteButton
          confirmTitle={t('openiddictAuthorizations.deleteConfirmTitle')}
          confirmMessage={t('openiddictAuthorizations.deleteConfirmMessage')}
          onDelete={() => deleteAuthorization(id)}
          invalidateKey={['openiddict-authorizations']}
          testID="authorization-delete"
        />
      </VStack>
    </AppScreen>
  );
}
