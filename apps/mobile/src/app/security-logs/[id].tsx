import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteSecurityLog, getSecurityLog } from '../../features/identity/security-logs-api';
import { toApiError } from '../../lib/errors';
import { showConfirmDialog } from '../../lib/confirm';
import { formatDateTime } from '../../lib/dates';

export default function SecurityLogDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['security-logs', id],
    queryFn: () => getSecurityLog(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteSecurityLog(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['security-logs'] });
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
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.userName ?? item.identity ?? item.id} subtitle={item.id}>
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
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('securityLogs.deleteConfirmTitle'),
              message: t('securityLogs.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="security-log-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
