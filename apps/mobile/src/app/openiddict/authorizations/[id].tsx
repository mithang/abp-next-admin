import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteAuthorization,
  getAuthorization,
} from '../../../features/openiddict/authorizations-api';
import { toApiError } from '../../../lib/errors';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

export default function AuthorizationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-authorizations', id],
    queryFn: () => getAuthorization(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteAuthorization(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['openiddict-authorizations'] });
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

  const authz = query.data;
  if (!authz) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={authz.subject ?? authz.id} subtitle={authz.id}>
      <VStack space="sm">
        <Field label={t('openiddictAuthorizations.applicationId')} value={authz.applicationId} />
        <Field label={t('openiddictAuthorizations.subject')} value={authz.subject} />
        <Field label={t('openiddictAuthorizations.type')} value={authz.type} />
        <Field label={t('openiddictAuthorizations.status')} value={authz.status} />
        <Field label={t('openiddictAuthorizations.scopes')} value={authz.scopes?.join(', ')} />
        <Field
          label={t('openiddictAuthorizations.creationDate')}
          value={authz.creationDate ? new Date(authz.creationDate).toLocaleString() : undefined}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(
              t('openiddictAuthorizations.deleteConfirmTitle'),
              t('openiddictAuthorizations.deleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteMutation.mutate(),
                },
              ],
            )
          }
          testID="authorization-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
