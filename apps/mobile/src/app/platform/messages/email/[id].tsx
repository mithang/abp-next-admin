import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../../components/ui/AppScreen';
import { AppButton } from '../../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteEmailMessage,
  getEmailMessage,
  sendEmailMessage,
} from '../../../../features/platform/platform-api';
import { toApiError } from '../../../../lib/errors';
import { showConfirmDialog } from '../../../../lib/confirm';
import { formatDateTime } from '../../../../lib/dates';
import { messageStatusText } from '../email';

/**
 * Chi tiết email: đúng modal xem chỉ đọc của web (subject/receiver/
 * sender/creationTime/content) + các field bảng (provider/status/
 * sendTime/sendCount/reason/cc) + nút Gửi lại và Xóa có xác nhận.
 */
export default function EmailMessageDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['platform-email-messages', id],
    queryFn: () => getEmailMessage(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteEmailMessage(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-email-messages'] });
      router.back();
    },
  });
  const sendMutation = useMutation({
    mutationFn: () => sendEmailMessage(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-email-messages'] });
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
    <AppScreen title={item.subject ?? item.receiver}>
      <VStack space="sm">
        <Text>
          {t('platformEmailMessages.subject')}: {item.subject ?? '—'}
        </Text>
        <Text>
          {t('platformEmailMessages.receiver')}: {item.receiver}
        </Text>
        <Text>
          {t('platformEmailMessages.from')}: {item.sender ?? item.from ?? '—'}
        </Text>
        {item.cc ? (
          <Text>
            {t('platformEmailMessages.cc')}: {item.cc}
          </Text>
        ) : null}
        <Text>
          {t('platformEmailMessages.provider')}: {item.provider ?? '—'}
        </Text>
        <Text>
          {t('platformEmailMessages.status')}:{' '}
          {messageStatusText(t, 'platformEmailMessages', item.status)}
        </Text>
        {item.sendTime ? (
          <Text>
            {t('platformEmailMessages.sendTime')}: {formatDateTime(item.sendTime)}
          </Text>
        ) : null}
        <Text>
          {t('platformEmailMessages.sendCount')}: {item.sendCount}
        </Text>
        {item.creationTime ? (
          <Text>
            {t('platformEmailMessages.creationTime')}: {formatDateTime(item.creationTime)}
          </Text>
        ) : null}
        {item.reason ? (
          <Text>
            {t('platformEmailMessages.reason')}: {item.reason}
          </Text>
        ) : null}
        <Text>
          {t('platformEmailMessages.content')}: {item.content}
        </Text>
        <AppButton
          title={t('platformEmailMessages.send')}
          variant="outline"
          loading={sendMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('platformEmailMessages.sendConfirmTitle'),
              message: t('platformEmailMessages.sendConfirmMessage'),
              confirmText: t('platformEmailMessages.send'),
              cancelText: t('common.cancel'),
              onConfirm: () => sendMutation.mutate(),
              destructive: false,
            })
          }
        />
        {sendMutation.isError ? <Text>{toApiError(sendMutation.error).message}</Text> : null}
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('platformEmailMessages.deleteConfirmTitle'),
              message: t('platformEmailMessages.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
