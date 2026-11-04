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
import { Text } from '@/components/ui/text';
import { getWebhookDefinitions } from '../../features/webhooks/webhooks-api';
import type { WebhookDefinitionDto } from '../../features/webhooks/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';
import { navPath } from '../../lib/nav-href';

function DefinitionRow({ item }: { item: WebhookDefinitionDto }) {
  return (
    <Link href={navPath('/webhooks/definitions', item.name)} asChild>
      <AppRowCard>
        <Text>{item.displayName}</Text>
        <Text>
          {item.groupName} · {item.name}
        </Text>
        <Text>{item.isEnabled ? 'enabled' : 'disabled'}</Text>
        {item.isStatic ? <Text>static</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/**
 * Danh sách định nghĩa Webhook: đúng backend — GET
 * /api/webhooks/definitions (ListResult, lọc filter/groupName, không
 * phân trang ABP). Định nghĩa tĩnh chỉ đọc như bảng web.
 */
export default function WebhookDefinitionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();
  const [groupName, setGroupName, debouncedGroup] = useDebouncedFilter();

  const query = useQuery({
    queryKey: ['webhook-definitions', debouncedFilter, debouncedGroup],
    queryFn: () =>
      getWebhookDefinitions({
        filter: debouncedFilter || undefined,
        groupName: debouncedGroup || undefined,
      }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('webhookDefinitions.title')}
      subtitle={`${t('webhookDefinitions.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookDefinitions.searchPlaceholder')}
        testID="webhook-definitions-search"
      />
      <AppSearchInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder={t('webhookDefinitions.groupNamePlaceholder')}
        testID="webhook-definitions-group"
      />
      <AppNavButton
        title={t('webhookDefinitions.createTitle')}
        href={'/webhooks/definitions/form'}
        testID="webhook-definitions-create"
      />
      <AppSpacer />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('webhookDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
