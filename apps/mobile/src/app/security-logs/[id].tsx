import { useRouteParams } from '../../lib/route-params';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../lib/not-found';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteSecurityLog, getSecurityLog } from '../../features/identity/security-logs-api';
import { formatDateTime } from '../../lib/dates';

export default function SecurityLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['security-logs', id],
    queryFn: () => getSecurityLog(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.userName ?? item.identity ?? item.id} subtitle={item.id}>
      <VStack space="sm">
        {item.action ? (
          <Text>
            {t('securityLogs.action')}: {item.action}
          </Text>
        ) : null}
        {item.applicationName ? (
          <Text>
            {t('securityLogs.application')}: {item.applicationName}
          </Text>
        ) : null}
        {item.clientId ? (
          <Text>
            {t('securityLogs.client')}: {item.clientId}
          </Text>
        ) : null}
        {item.clientIpAddress ? (
          <Text>
            {t('securityLogs.ipAddress')}: {item.clientIpAddress}
          </Text>
        ) : null}
        {item.browserInfo ? (
          <Text>
            {t('securityLogs.browser')}: {item.browserInfo}
          </Text>
        ) : null}
        {item.creationTime ? (
          <Text>
            {t('securityLogs.creationTime')}: {formatDateTime(item.creationTime)}
          </Text>
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
