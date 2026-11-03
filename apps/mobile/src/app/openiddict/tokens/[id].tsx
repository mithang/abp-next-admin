import { useRouteParams } from '../../../lib/route-params';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteToken, getToken } from '../../../features/openiddict/tokens-api';
import { formatDateTime } from '../../../lib/dates';

/**
 * Detail token chỉ hiển thị metadata — KHÔNG hiển thị payload token
 * (nhạy cảm) dù DTO backend có field đó.
 */
export default function TokenDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-tokens', id],
    queryFn: () => getToken(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const token = query.data;
  if (!token) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={token.referenceId ?? token.id} subtitle={token.id}>
      <VStack space="sm">
        <AppDetailField label={t('openiddictTokens.applicationId')} value={token.applicationId} />
        <AppDetailField
          label={t('openiddictTokens.authorizationId')}
          value={token.authorizationId}
        />
        <AppDetailField label={t('openiddictTokens.subject')} value={token.subject} />
        <AppDetailField label={t('openiddictTokens.type')} value={token.type} />
        <AppDetailField label={t('openiddictTokens.status')} value={token.status} />
        <AppDetailField label={t('openiddictTokens.referenceId')} value={token.referenceId} />
        <AppDetailField
          label={t('openiddictTokens.creationDate')}
          value={formatDateTime(token.creationDate)}
        />
        <AppDetailField
          label={t('openiddictTokens.expirationDate')}
          value={formatDateTime(token.expirationDate)}
        />
        <AppDeleteButton
          confirmTitle={t('openiddictTokens.deleteConfirmTitle')}
          confirmMessage={t('openiddictTokens.deleteConfirmMessage')}
          onDelete={() => deleteToken(id)}
          invalidateKey={['openiddict-tokens']}
          testID="token-delete"
        />
      </VStack>
    </AppScreen>
  );
}
