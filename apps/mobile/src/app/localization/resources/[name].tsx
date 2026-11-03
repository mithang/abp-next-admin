import { useRouteParams } from '../../../lib/route-params';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteResource, getResource } from '../../../features/localization/localization-api';
import { navHref } from '../../../lib/nav-href';

/** Chi tiết tài nguyên: khóa là name; web không có khái niệm tĩnh ở đây nên luôn có Sửa/Xóa. */
export default function ResourceDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['resources', name],
    queryFn: () => getResource(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('resources.name')} value={item.name} />
        <AppDetailField label={t('resources.displayName')} value={item.displayName} />
        <AppDetailField label={t('resources.description')} value={item.description} />
        <AppDetailField label={t('resources.defaultCultureName')} value={item.defaultCultureName} />
        <Text>
          {t('resources.enable')}: {item.enable ? t('resources.enabled') : t('resources.disabled')}
        </Text>
        <AppDetailField label={t('resources.creationTime')} value={item.creationTime} />
        <AppNavButton
          title={t('resources.editTitle')}
          href={navHref('/localization/resources/form', { name: item.name })}
          variant="outline"
          testID="resource-edit"
        />
        <AppDeleteButton
          confirmTitle={t('resources.deleteConfirmTitle')}
          confirmMessage={t('resources.deleteConfirmMessage')}
          onDelete={() => deleteResource(name)}
          invalidateKey={['resources']}
          testID="resource-delete"
        />
      </VStack>
    </AppScreen>
  );
}
