import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteToken, getToken } from '../../../features/openiddict/tokens-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

/**
 * Detail token chỉ hiển thị metadata — KHÔNG hiển thị payload token
 * (nhạy cảm) dù DTO backend có field đó.
 */
export default function TokenDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-tokens', id],
    queryFn: () => getToken(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteToken(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['openiddict-tokens'] });
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

  const token = query.data;
  if (!token) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={token.referenceId ?? token.id} subtitle={token.id}>
      <VStack space="sm">
        <Field label={t('openiddictTokens.applicationId')} value={token.applicationId} />
        <Field label={t('openiddictTokens.authorizationId')} value={token.authorizationId} />
        <Field label={t('openiddictTokens.subject')} value={token.subject} />
        <Field label={t('openiddictTokens.type')} value={token.type} />
        <Field label={t('openiddictTokens.status')} value={token.status} />
        <Field label={t('openiddictTokens.referenceId')} value={token.referenceId} />
        <Field
          label={t('openiddictTokens.creationDate')}
          value={formatDateTime(token.creationDate)}
        />
        <Field
          label={t('openiddictTokens.expirationDate')}
          value={formatDateTime(token.expirationDate)}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('openiddictTokens.deleteConfirmTitle'),
              message: t('openiddictTokens.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="token-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
