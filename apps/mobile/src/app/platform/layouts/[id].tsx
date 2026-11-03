import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteLayout, getLayout } from '../../../features/platform/platform-api';
import { navHref } from '../../../lib/nav-href';

/** Chi tiết bố cục: RouteDto + framework + dataId (2 field chỉ đọc ở đây, sửa không đổi chúng). */
export default function LayoutDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('platform-layouts', id, getLayout);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('platformLayouts.name')}: {item.name}
        </Text>
        <Text>
          {t('platformLayouts.path')}: {item.path}
        </Text>
        <Text>
          {t('platformLayouts.framework')}: {item.framework}
        </Text>
        <Text>
          {t('platformLayouts.dataId')}: {item.dataId}
        </Text>
        {item.redirect ? (
          <Text>
            {t('platformLayouts.redirect')}: {item.redirect}
          </Text>
        ) : null}
        {item.description ? (
          <Text>
            {t('platformLayouts.description')}: {item.description}
          </Text>
        ) : null}
        {item.meta && Object.keys(item.meta).length > 0 ? (
          <Text>{JSON.stringify(item.meta)}</Text>
        ) : null}
        <AppNavButton
          title={t('platformLayouts.editTitle')}
          href={navHref('/platform/layouts/form', { id: item.id })}
          variant="outline"
        />
        <AppDeleteButton
          confirmTitle={t('platformLayouts.deleteConfirmTitle')}
          confirmMessage={t('platformLayouts.deleteConfirmMessage')}
          onDelete={() => deleteLayout(id)}
          invalidateKey={['platform-layouts']}
          testID="platform-layout-delete"
        />
      </VStack>
    </AppScreen>
  );
}
