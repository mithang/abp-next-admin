import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppSpacer } from '../../components/ui/AppSpacer';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { Text } from '@/components/ui/text';
import { getWebhookGroupDefinitions } from '../../features/webhooks/webhooks-api';
import type { WebhookGroupDefinitionDto } from '../../features/webhooks/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';
import { navPath } from '../../lib/nav-href';

function GroupRow({ item }: { item: WebhookGroupDefinitionDto }) {
  return (
    <Link href={navPath('/webhooks/groups', item.name)} asChild>
      <AppRowCard>
        <Text>{item.displayName}</Text>
        <Text>{item.name}</Text>
        <AppOptionalText show={item.isStatic} value="static" />
      </AppRowCard>
    </Link>
  );
}

/**
 * Danh sách nhóm Webhook: đúng backend — GET
 * /api/webhooks/definitions/groups (ListResult, lọc filter, không phân
 * trang ABP). Nhóm tĩnh chỉ đọc như bảng web (detail ẩn Sửa/Xóa).
 */
export default function WebhookGroupsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

  const query = useQuery({
    queryKey: ['webhook-groups', debouncedFilter],
    queryFn: () => getWebhookGroupDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('webhookGroups.title')}
      subtitle={`${t('webhookGroups.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookGroups.searchPlaceholder')}
        testID="webhook-groups-search"
      />
      <AppNavButton
        title={t('webhookGroups.createTitle')}
        href={'/webhooks/groups/form'}
        testID="webhook-groups-create"
      />
      <AppSpacer />
      <AppList items={items} {...listQueryProps(query)} emptyMessage={t('webhookGroups.empty')}>
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <GroupRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
