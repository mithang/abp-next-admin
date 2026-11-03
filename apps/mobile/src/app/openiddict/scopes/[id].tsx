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
import { deleteScope, getScope } from '../../../features/openiddict/scopes-api';
import { navHref } from '../../../lib/nav-href';

export default function ScopeDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['openiddict-scopes', id],
    queryFn: () => getScope(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const scope = query.data;
  if (!scope) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={scope.displayName || scope.name} subtitle={scope.id}>
      <VStack space="sm">
        <AppDetailField label={t('openiddictScopes.name')} value={scope.name} />
        <AppDetailField label={t('openiddictScopes.displayName')} value={scope.displayName} />
        <AppDetailField label={t('openiddictScopes.description')} value={scope.description} />
        <AppDetailField
          label={t('openiddictScopes.resources')}
          value={scope.resources?.join(', ')}
        />
        <AppNavButton
          title={t('openiddictScopes.editTitle')}
          href={navHref('/openiddict/scopes/form', { id: scope.id })}
          variant="outline"
          testID="scope-edit"
        />
        <AppDeleteButton
          confirmTitle={t('openiddictScopes.deleteConfirmTitle')}
          confirmMessage={t('openiddictScopes.deleteConfirmMessage')}
          onDelete={() => deleteScope(id)}
          invalidateKey={['openiddict-scopes']}
          testID="scope-delete"
        />
      </VStack>
    </AppScreen>
  );
}
