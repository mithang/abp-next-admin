import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import {
  deleteAuthorization,
  getAuthorization,
} from '../../../features/openiddict/authorizations-api';
import { formatDateTime } from '../../../lib/dates';

export default function AuthorizationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('openiddict-authorizations', id, getAuthorization);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const authz = query.data;
  if (!authz) return notFoundElement(t('common.empty'));

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
