import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteLayout, getLayout } from '../../../features/platform/platform-api';

/** Chi tiết bố cục: RouteDto + framework + dataId (2 field chỉ đọc ở đây, sửa không đổi chúng). */
export default function LayoutDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const query = useQuery({
    queryKey: ['platform-layouts', id],
    queryFn: () => getLayout(id),
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
        <AppButton
          title={t('platformLayouts.editTitle')}
          onPress={() => router.push(`/platform/layouts/form?id=${encodeURIComponent(item.id)}`)}
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
