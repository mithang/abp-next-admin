import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteAuditLog, getAuditLog } from '../../../features/auditing/auditing-api';
import { entityChangeTypeName } from '../../../features/auditing/types';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

export default function AuditLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const invalidateAndBack = useInvalidateAndBack(['audit-logs']);
  const query = useQuery({
    queryKey: ['audit-logs', id],
    queryFn: () => getAuditLog(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteAuditLog(id),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen
      scrollable
      title={`${item.httpMethod ?? ''} ${item.httpStatusCode ?? ''}`.trim() || item.id}
      subtitle={item.url}
    >
      <VStack space="sm">
        {item.userName ? (
          <Text>
            {t('auditLogs.userName')}: {item.userName}
          </Text>
        ) : null}
        {item.applicationName ? (
          <Text>
            {t('auditLogs.application')}: {item.applicationName}
          </Text>
        ) : null}
        {item.executionTime ? (
          <Text>
            {t('auditLogs.executionTime')}: {formatDateTime(item.executionTime)}
          </Text>
        ) : null}
        {item.executionDuration !== undefined ? (
          <Text>
            {t('auditLogs.executionDuration')}: {item.executionDuration} ms
          </Text>
        ) : null}
        {item.clientIpAddress ? (
          <Text>
            {t('auditLogs.ipAddress')}: {item.clientIpAddress}
          </Text>
        ) : null}
        {item.clientId ? (
          <Text>
            {t('auditLogs.client')}: {item.clientId}
          </Text>
        ) : null}
        {item.correlationId ? (
          <Text>
            {t('auditLogs.correlation')}: {item.correlationId}
          </Text>
        ) : null}
        {item.browserInfo ? (
          <Text>
            {t('auditLogs.browser')}: {item.browserInfo}
          </Text>
        ) : null}
        {item.comments ? (
          <Text>
            {t('auditLogs.comments')}: {item.comments}
          </Text>
        ) : null}
        {item.exceptions ? (
          <Text>
            {t('auditLogs.exceptions')}: {item.exceptions}
          </Text>
        ) : null}
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
                <Text>
                  {entityChangeTypeName(change.changeType)}: {change.entityTypeFullName}
                </Text>
                {(change.propertyChanges ?? []).map((prop) => (
                  <Text key={prop.id}>
                    {prop.propertyName}: {prop.originalValue ?? ''} → {prop.newValue ?? ''}
                  </Text>
                ))}
              </VStack>
            ))}
          </>
        ) : null}
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('auditLogs.deleteConfirmTitle'),
              message: t('auditLogs.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="audit-log-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
