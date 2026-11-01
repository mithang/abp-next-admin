import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteApplication, getApplication } from '../../../features/openiddict/applications-api';
import { toApiError } from '../../../lib/errors';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

export default function ApplicationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({ queryKey: ['openiddict-applications', id], queryFn: () => getApplication(id), enabled: Boolean(id) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['openiddict-applications'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }

  const app = query.data;
  if (!app) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={app.displayName || app.clientId} subtitle={app.id}>
      <VStack space="sm">
        <Field label={t('openiddictApplications.clientId')} value={app.clientId} />
        <Field label={t('openiddictApplications.displayName')} value={app.displayName} />
        <Field label={t('openiddictApplications.clientType')} value={app.clientType} />
        <Field label={t('openiddictApplications.applicationType')} value={app.applicationType} />
        <Field label={t('openiddictApplications.consentType')} value={app.consentType} />
        <Field label={t('openiddictApplications.clientUri')} value={app.clientUri} />
        <Field label={t('openiddictApplications.logoUri')} value={app.logoUri} />
        <Field label={t('openiddictApplications.redirectUris')} value={app.redirectUris?.join(', ')} />
        <Field label={t('openiddictApplications.postLogoutRedirectUris')} value={app.postLogoutRedirectUris?.join(', ')} />
        <Field label={t('openiddictApplications.grantTypes')} value={app.grantTypes?.join(', ')} />
        <Field label={t('openiddictApplications.responseTypes')} value={app.responseTypes?.join(', ')} />
        <Field label={t('openiddictApplications.scopes')} value={app.scopes?.join(', ')} />
        <AppButton
          title={t('openiddictApplications.editTitle')}
          onPress={() => router.push(`/openiddict/applications/form?id=${encodeURIComponent(app.id)}`)}
          variant="outline"
          testID="application-edit"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(t('openiddictApplications.deleteConfirmTitle'), t('openiddictApplications.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
            ])
          }
          testID="application-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
