import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteAuditLog, getAuditLog } from '../../../features/auditing/auditing-api';
import { entityChangeTypeName } from '../../../features/auditing/types';
import { formatDateTime } from '../../../lib/dates';

export default function AuditLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('audit-logs', id, getAuditLog);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen
      scrollable
      title={`${item.httpMethod ?? ''} ${item.httpStatusCode ?? ''}`.trim() || item.id}
      subtitle={item.url}
    >
      <VStack space="sm">
        <AppDetailField label={t('auditLogs.userName')} value={item.userName} />
        <AppDetailField label={t('auditLogs.application')} value={item.applicationName} />
        {item.executionTime ? (
          <AppDetailField
            label={t('auditLogs.executionTime')}
            value={formatDateTime(item.executionTime)}
          />
        ) : null}
        {item.executionDuration !== undefined ? (
          <AppDetailField
            label={t('auditLogs.executionDuration')}
            value={`${item.executionDuration} ms`}
          />
        ) : null}
        <AppDetailField label={t('auditLogs.ipAddress')} value={item.clientIpAddress} />
        <AppDetailField label={t('auditLogs.client')} value={item.clientId} />
        <AppDetailField label={t('auditLogs.correlation')} value={item.correlationId} />
        <AppDetailField label={t('auditLogs.browser')} value={item.browserInfo} />
        <AppDetailField label={t('auditLogs.comments')} value={item.comments} />
        <AppDetailField label={t('auditLogs.exceptions')} value={item.exceptions} />
        {(item.actions ?? []).length > 0 ? (
          <>
            <Text>{t('auditLogs.actions')}:</Text>
            {(item.actions ?? []).map((action) => (
              <Text key={action.id}>
                {action.serviceName} — {action.methodName} ({action.executionDuration ?? ''} ms)
              </Text>
            ))}
          </>
        ) : null}
        {(item.entityChanges ?? []).length > 0 ? (
          <>
            <Text>{t('auditLogs.entityChanges')}:</Text>
            {(item.entityChanges ?? []).map((change) => (
              <VStack key={change.id} space="xs">
                <AppDetailField
                  label={entityChangeTypeName(change.changeType)}
                  value={change.entityTypeFullName}
                />
                {(change.propertyChanges ?? []).map((prop) => (
                  <AppDetailField
                    key={prop.id}
                    label={prop.propertyName ?? ''}
                    value={`${prop.originalValue ?? ''} → ${prop.newValue ?? ''}`}
                  />
                ))}
              </VStack>
            ))}
          </>
        ) : null}
        <AppDeleteButton
          confirmTitle={t('auditLogs.deleteConfirmTitle')}
          confirmMessage={t('auditLogs.deleteConfirmMessage')}
          onDelete={() => deleteAuditLog(id)}
          invalidateKey={['audit-logs']}
          testID="audit-log-delete"
        />
      </VStack>
    </AppScreen>
  );
}
