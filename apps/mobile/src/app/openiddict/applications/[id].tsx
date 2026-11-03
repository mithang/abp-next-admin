import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteApplication, getApplication } from '../../../features/openiddict/applications-api';

export default function ApplicationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-applications', id],
    queryFn: () => getApplication(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const app = query.data;
  if (!app) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={app.displayName || app.clientId} subtitle={app.id}>
      <VStack space="sm">
        <AppDetailField label={t('openiddictApplications.clientId')} value={app.clientId} />
        <AppDetailField label={t('openiddictApplications.displayName')} value={app.displayName} />
        <AppDetailField label={t('openiddictApplications.clientType')} value={app.clientType} />
        <AppDetailField
          label={t('openiddictApplications.applicationType')}
          value={app.applicationType}
        />
        <AppDetailField label={t('openiddictApplications.consentType')} value={app.consentType} />
        <AppDetailField label={t('openiddictApplications.clientUri')} value={app.clientUri} />
        <AppDetailField label={t('openiddictApplications.logoUri')} value={app.logoUri} />
        <AppDetailField
          label={t('openiddictApplications.redirectUris')}
          value={app.redirectUris?.join(', ')}
        />
        <AppDetailField
          label={t('openiddictApplications.postLogoutRedirectUris')}
          value={app.postLogoutRedirectUris?.join(', ')}
        />
        <AppDetailField
          label={t('openiddictApplications.grantTypes')}
          value={app.grantTypes?.join(', ')}
        />
        <AppDetailField
          label={t('openiddictApplications.responseTypes')}
          value={app.responseTypes?.join(', ')}
        />
        <AppDetailField label={t('openiddictApplications.scopes')} value={app.scopes?.join(', ')} />
        <AppButton
          title={t('openiddictApplications.editTitle')}
          onPress={() =>
            router.push(`/openiddict/applications/form?id=${encodeURIComponent(app.id)}`)
          }
          variant="outline"
          testID="application-edit"
        />
        <AppDeleteButton
          confirmTitle={t('openiddictApplications.deleteConfirmTitle')}
          confirmMessage={t('openiddictApplications.deleteConfirmMessage')}
          onDelete={() => deleteApplication(id)}
          invalidateKey={['openiddict-applications']}
          testID="application-delete"
        />
      </VStack>
    </AppScreen>
  );
}
