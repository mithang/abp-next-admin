import { useRouteParams } from '../../lib/route-params';
import { useDetailQuery } from '../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppDetailField } from '../../components/ui/AppDetailField';

import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../lib/not-found';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteSecurityLog, getSecurityLog } from '../../features/identity/security-logs-api';
import { formatDateTime } from '../../lib/dates';

export default function SecurityLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('security-logs', id, getSecurityLog);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.userName ?? item.identity ?? item.id} subtitle={item.id}>
      <VStack space="sm">
        <AppDetailField label={t('securityLogs.action')} value={item.action} />
        <AppDetailField label={t('securityLogs.application')} value={item.applicationName} />
        <AppDetailField label={t('securityLogs.client')} value={item.clientId} />
        <AppDetailField label={t('securityLogs.ipAddress')} value={item.clientIpAddress} />
        <AppDetailField label={t('securityLogs.browser')} value={item.browserInfo} />
        {item.creationTime ? (
          <AppDetailField
            label={t('securityLogs.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        <AppDeleteButton
          confirmTitle={t('securityLogs.deleteConfirmTitle')}
          confirmMessage={t('securityLogs.deleteConfirmMessage')}
          onDelete={() => deleteSecurityLog(id)}
          invalidateKey={['security-logs']}
          testID="security-log-delete"
        />
      </VStack>
    </AppScreen>
  );
}
