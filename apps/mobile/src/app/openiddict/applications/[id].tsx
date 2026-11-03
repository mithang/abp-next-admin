import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteApplication, getApplication } from '../../../features/openiddict/applications-api';
import { navHref } from '../../../lib/nav-href';

export default function ApplicationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-applications', id],
    queryFn: () => getApplication(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const app = query.data;
  if (!app) return notFoundElement(t('common.empty'));

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
        <AppNavButton
          title={t('openiddictApplications.editTitle')}
          href={navHref('/openiddict/applications/form', { id: app.id })}
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
