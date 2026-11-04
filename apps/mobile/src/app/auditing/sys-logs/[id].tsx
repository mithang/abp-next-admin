import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getSysLog } from '../../../features/auditing/auditing-api';
import { logLevelName } from '../../../features/auditing/types';
import { formatDateTime } from '../../../lib/dates';

export default function SysLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('sys-logs', id, getSysLog);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));
  const fields = item.fields ?? {};

  return (
    <AppScreen
      scrollable
      title={`${logLevelName(item.level)}`}
      subtitle={formatDateTime(item.timeStamp)}
    >
      <VStack space="sm">
        <AppDetailField label={t('sysLogs.message')} value={item.message} />
        <AppDetailField label={t('sysLogs.application')} value={fields.application} />
        <AppDetailField label={t('sysLogs.machine')} value={fields.machineName} />
        <AppDetailField label={t('sysLogs.environment')} value={fields.environment} />
        <AppDetailField label={t('sysLogs.requestPath')} value={fields.requestPath} />
        <AppDetailField label={t('sysLogs.requestId')} value={fields.requestId} />
        <AppDetailField label={t('sysLogs.connectionId')} value={fields.connectionId} />
        <AppDetailField label={t('sysLogs.correlation')} value={fields.correlationId} />
        <AppDetailField label={t('sysLogs.client')} value={fields.clientId} />
        <AppDetailField label={t('sysLogs.user')} value={fields.userId} />
        <AppDetailField label={t('sysLogs.action')} value={fields.actionName} />
        {(item.exceptions ?? []).length > 0 ? (
          <>
            <Text>{t('sysLogs.exceptions')}:</Text>
            {(item.exceptions ?? []).map((ex, index) => (
              <AppDetailField
                key={`${ex.class ?? 'ex'}-${index}`}
                label={ex.class ?? ''}
                value={ex.message ?? ''}
              />
            ))}
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
