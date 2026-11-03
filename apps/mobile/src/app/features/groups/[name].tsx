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
import { deleteFeatureGroup, getFeatureGroup } from '../../../features/features/feature-groups-api';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết nhóm tính năng. Modal web vô hiệu mọi field và ẩn nút xác nhận
 * với nhóm tĩnh nên mobile coi tĩnh là chỉ đọc: không Sửa, không Xóa.
 */
export default function FeatureGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['feature-groups', name],
    queryFn: () => getFeatureGroup(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('featureGroups.name')} value={item.name} />
        <AppDetailField label={t('featureGroups.displayName')} value={item.displayName} />
        {item.isStatic ? <Text>{t('featureGroups.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('featureGroups.editTitle')}
              href={navHref('/features/groups/form', { name: item.name })}
              variant="outline"
              testID="feature-group-edit"
            />
            <AppDeleteButton
              confirmTitle={t('featureGroups.deleteConfirmTitle')}
              confirmMessage={t('featureGroups.deleteConfirmMessage')}
              onDelete={() => deleteFeatureGroup(name)}
              invalidateKey={['feature-groups']}
              testID="feature-group-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
