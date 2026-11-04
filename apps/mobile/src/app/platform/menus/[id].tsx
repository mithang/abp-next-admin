import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteMenu, getMenu } from '../../../features/platform/platform-api';
import { navHref } from '../../../lib/nav-href';

/** Chi tiết menu: RouteDto + code/component/framework/layoutId/isPublic/startup + meta JSON. */
export default function MenuDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('platform-menus', id, getMenu);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <AppDetailField label={t('platformMenus.name')} value={item.name} />
        <AppDetailField label={t('platformMenus.code')} value={item.code} />
        <AppDetailField label={t('platformMenus.path')} value={item.path} />
        <AppDetailField label={t('platformMenus.component')} value={item.component} />
        <AppDetailField label={t('platformMenus.framework')} value={item.framework} />
        <AppDetailField label={t('platformMenus.layoutId')} value={item.layoutId} />
        <AppDetailField label={t('platformMenus.parentId')} value={item.parentId} />
        <AppDetailField label={t('platformMenus.redirect')} value={item.redirect} />
        <AppDetailField label={t('platformMenus.description')} value={item.description} />
        <AppDetailField
          label={t('platformMenus.isPublic')}
          value={item.isPublic ? t('common.yes') : t('common.no')}
        />
        <AppDetailField
          label={t('platformMenus.startup')}
          value={item.startup ? t('common.yes') : t('common.no')}
        />
        {item.meta && Object.keys(item.meta).length > 0 ? (
          <AppDetailField label="Meta" value={JSON.stringify(item.meta)} />
        ) : null}
        <AppNavButton
          title={t('platformMenus.editTitle')}
          href={navHref('/platform/menus/form', { id: item.id })}
        />
        <AppNavButton
          title={t('platformMenus.createChildTitle')}
          href={navHref('/platform/menus/form', { parentId: item.id, layoutId: item.layoutId })}
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
