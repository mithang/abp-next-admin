import { useRouteParams } from '../../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../../components/ui/AppScreen';
import { AppButton } from '../../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../../lib/not-found';
import { queryStateElement } from '../../../../lib/query-state';
import { mutationErrorElement } from '../../../../lib/mutation-error';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteEmailMessage,
  getEmailMessage,
  sendEmailMessage,
} from '../../../../features/platform/platform-api';
import { showConfirmDialog } from '../../../../lib/confirm';
import { formatDateTime } from '../../../../lib/dates';
import { useInvalidateQueries } from '../../../../lib/mutation-success';
import { messageStatusText } from '../email';

/**
 * Chi tiết email: đúng modal xem chỉ đọc của web (subject/receiver/
 * sender/creationTime/content) + các field bảng (provider/status/
 * sendTime/sendCount/reason/cc) + nút Gửi lại và Xóa có xác nhận.
 */
export default function EmailMessageDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const invalidate = useInvalidateQueries(['platform-email-messages']);
  const query = useQuery({
    queryKey: ['platform-email-messages', id],
    queryFn: () => getEmailMessage(id),
    enabled: Boolean(id),
  });
  const sendMutation = useMutation({
    mutationFn: () => sendEmailMessage(id),
    onSuccess: invalidate,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.subject ?? item.receiver}>
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
        {mutationErrorElement(sendMutation)}
        <AppDeleteButton
          confirmTitle={t('platformEmailMessages.deleteConfirmTitle')}
          confirmMessage={t('platformEmailMessages.deleteConfirmMessage')}
          onDelete={() => deleteEmailMessage(id)}
          invalidateKey={['platform-email-messages']}
        />
      </VStack>
    </AppScreen>
  );
}
