import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getSettingDefinitions } from '../../features/settings/settings-definitions-api';
import type { SettingDefinitionDto } from '../../features/settings/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';
import { navPath } from '../../lib/nav-href';

function DefinitionRow({ item }: { item: SettingDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={navPath('/settings/definitions', item.name)} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        {item.isStatic ? <Text>· {t('settingDefinitions.static')}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/** Danh sách định nghĩa cài đặt: ListResult, lọc filter phía server, phân trang phía client như web. */
export default function SettingDefinitionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

  const query = useQuery({
    queryKey: ['setting-definitions', debouncedFilter],
    queryFn: () => getSettingDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('settingDefinitions.title')}
      subtitle={`${t('settingDefinitions.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('settingDefinitions.searchPlaceholder')}
        testID="setting-definitions-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('settingDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('settingDefinitions.createTitle')}
        href={'/settings/definitions/form'}
        testID="setting-definitions-create"
      />
    </AppScreen>
  );
}
