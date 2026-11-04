import { useRouteParams } from '../../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../../components/ui/AppScreen';
import { AppDetailField } from '../../../../components/ui/AppDetailField';

import { AppButton } from '../../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../../lib/not-found';
import { queryStateElement } from '../../../../lib/query-state';
import { mutationErrorElement } from '../../../../lib/mutation-error';
import { VStack } from '@/components/ui/vstack';
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
  const query = useDetailQuery('platform-email-messages', id, getEmailMessage);
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
        <AppDetailField label={t('platformEmailMessages.subject')} value={item.subject ?? '—'} />
        <AppDetailField label={t('platformEmailMessages.receiver')} value={item.receiver} />
        <AppDetailField
          label={t('platformEmailMessages.from')}
          value={item.sender ?? item.from ?? '—'}
        />
        <AppDetailField label={t('platformEmailMessages.cc')} value={item.cc} />
        <AppDetailField label={t('platformEmailMessages.provider')} value={item.provider ?? '—'} />
        <AppDetailField
          label={t('platformEmailMessages.status')}
          value={messageStatusText(t, 'platformEmailMessages', item.status)}
        />
        {item.sendTime ? (
          <AppDetailField
            label={t('platformEmailMessages.sendTime')}
            value={formatDateTime(item.sendTime)}
          />
        ) : null}
        <AppDetailField label={t('platformEmailMessages.sendCount')} value={item.sendCount} />
        {item.creationTime ? (
          <AppDetailField
            label={t('platformEmailMessages.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        <AppDetailField label={t('platformEmailMessages.reason')} value={item.reason} />
        <AppDetailField label={t('platformEmailMessages.content')} value={item.content} />
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
