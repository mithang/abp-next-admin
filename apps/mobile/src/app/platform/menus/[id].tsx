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
import { deleteMenu, getMenu } from '../../../features/platform/platform-api';

/** Chi tiết menu: RouteDto + code/component/framework/layoutId/isPublic/startup + meta JSON. */
export default function MenuDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['platform-menus', id],
    queryFn: () => getMenu(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('platformMenus.name')}: {item.name}
        </Text>
        <Text>
          {t('platformMenus.code')}: {item.code}
        </Text>
        <Text>
          {t('platformMenus.path')}: {item.path}
        </Text>
        <Text>
          {t('platformMenus.component')}: {item.component}
        </Text>
        <Text>
          {t('platformMenus.framework')}: {item.framework}
        </Text>
        <Text>
          {t('platformMenus.layoutId')}: {item.layoutId}
        </Text>
        {item.parentId ? (
          <Text>
            {t('platformMenus.parentId')}: {item.parentId}
          </Text>
        ) : null}
        {item.redirect ? (
          <Text>
            {t('platformMenus.redirect')}: {item.redirect}
          </Text>
        ) : null}
        {item.description ? (
          <Text>
            {t('platformMenus.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('platformMenus.isPublic')}: {item.isPublic ? t('common.yes') : t('common.no')}
        </Text>
        <Text>
          {t('platformMenus.startup')}: {item.startup ? t('common.yes') : t('common.no')}
        </Text>
        {item.meta && Object.keys(item.meta).length > 0 ? (
          <Text>Meta: {JSON.stringify(item.meta)}</Text>
        ) : null}
        <AppNavButton
          title={t('platformMenus.editTitle')}
          href={`/platform/menus/form?id=${encodeURIComponent(item.id)}`}
        />
        <AppNavButton
          title={t('platformMenus.createChildTitle')}
          href={`/platform/menus/form?parentId=${encodeURIComponent(item.id)}&layoutId=${encodeURIComponent(item.layoutId)}`}
          variant="outline"
        />
        <AppDeleteButton
          confirmTitle={t('platformMenus.deleteConfirmTitle')}
          confirmMessage={t('platformMenus.deleteConfirmMessage')}
          onDelete={() => deleteMenu(id)}
          invalidateKey={['platform-menus-all']}
        />
      </VStack>
    </AppScreen>
  );
}
