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
import { getFeatureDefinitions } from '../../features/features/feature-definitions-api';
import type { FeatureDefinitionDto } from '../../features/features/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';

function DefinitionRow({ item }: { item: FeatureDefinitionDto }) {
  return (
    <Link href={`/features/definitions/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        <Text>{item.groupName}</Text>
      </AppRowCard>
    </Link>
  );
}

/** Danh sách định nghĩa tính năng: ListResult, lọc filter/groupName phía server. */
export default function FeatureDefinitionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

  const query = useQuery({
    queryKey: ['feature-definitions', debouncedFilter],
    queryFn: () => getFeatureDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('featureDefinitions.title')}
      subtitle={`${t('featureDefinitions.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('featureDefinitions.searchPlaceholder')}
        testID="feature-definitions-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('featureDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('featureDefinitions.createTitle')}
        href={'/features/definitions/form'}
        testID="feature-definitions-create"
      />
    </AppScreen>
  );
}
