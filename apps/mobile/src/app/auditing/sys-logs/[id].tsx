import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getSysLog } from '../../../features/auditing/auditing-api';
import { logLevelName } from '../../../features/auditing/types';
import { toApiError } from '../../../lib/errors';

export default function SysLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({ queryKey: ['sys-logs', id], queryFn: () => getSysLog(id), enabled: Boolean(id) });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;
  const fields = item.fields ?? {};

  return (
    <AppScreen title={`${logLevelName(item.level)}`} subtitle={item.timeStamp ? new Date(item.timeStamp).toLocaleString() : undefined}>
      <VStack space="sm">
        {item.message ? (
          <Text>
            {t('sysLogs.message')}: {item.message}
          </Text>
        ) : null}
        {fields.application ? (
          <Text>
            {t('sysLogs.application')}: {fields.application}
          </Text>
        ) : null}
        {fields.machineName ? (
          <Text>
            {t('sysLogs.machine')}: {fields.machineName}
          </Text>
        ) : null}
        {fields.environment ? (
          <Text>
            {t('sysLogs.environment')}: {fields.environment}
          </Text>
        ) : null}
        {fields.requestPath ? (
          <Text>
            {t('sysLogs.requestPath')}: {fields.requestPath}
          </Text>
        ) : null}
        {fields.requestId ? (
          <Text>
            {t('sysLogs.requestId')}: {fields.requestId}
          </Text>
        ) : null}
        {fields.connectionId ? (
          <Text>
            {t('sysLogs.connectionId')}: {fields.connectionId}
          </Text>
        ) : null}
        {fields.correlationId ? (
          <Text>
            {t('sysLogs.correlation')}: {fields.correlationId}
          </Text>
        ) : null}
        {fields.clientId ? (
          <Text>
            {t('sysLogs.client')}: {fields.clientId}
          </Text>
        ) : null}
        {fields.userId ? (
          <Text>
            {t('sysLogs.user')}: {fields.userId}
          </Text>
        ) : null}
        {fields.actionName ? (
          <Text>
            {t('sysLogs.action')}: {fields.actionName}
          </Text>
        ) : null}
        {(item.exceptions ?? []).length > 0 ? (
          <>
            <Text>{t('sysLogs.exceptions')}:</Text>
            {(item.exceptions ?? []).map((ex, index) => (
              <Text key={`${ex.class ?? 'ex'}-${index}`}>
                {ex.class ?? ''}: {ex.message ?? ''}
              </Text>
            ))}
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
