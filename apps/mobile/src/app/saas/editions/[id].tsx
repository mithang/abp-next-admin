import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteEdition, getEdition } from '../../../features/saas/saas-api';

/** Chi tiết phiên bản: DTO chỉ có displayName (+ audit/extraProperties). */
export default function EditionDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['saas-editions', id],
    queryFn: () => getEdition(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        {item.creationTime ? (
          <Text>
            {t('saasEditions.creationTime')}: {item.creationTime}
          </Text>
        ) : null}
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <Text>
            {t('saasEditions.extraProperties')}: {JSON.stringify(item.extraProperties)}
          </Text>
        ) : null}
        <AppNavButton
          title={t('saasEditions.editTitle')}
          href={`/saas/editions/form?id=${encodeURIComponent(item.id)}`}
          variant="outline"
        />
        <AppDeleteButton
          confirmTitle={t('saasEditions.deleteConfirmTitle')}
          confirmMessage={t('saasEditions.deleteConfirmMessage')}
          onDelete={() => deleteEdition(id)}
          invalidateKey={['saas-editions']}
          testID="saas-edition-delete"
        />
      </VStack>
    </AppScreen>
  );
}
