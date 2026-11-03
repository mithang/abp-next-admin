import { FlatList, View } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getTextTemplateDefinitions } from '../../features/text-templating/text-templating-api';
import type { TextTemplateDefinitionDto } from '../../features/text-templating/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';

function DefinitionRow({ item }: { item: TextTemplateDefinitionDto }) {
  return (
    <Link href={`/text-templating/definitions/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName}</Text>
        <Text>{item.name}</Text>
        {item.isStatic ? <Text>static</Text> : null}
        {item.isLayout ? <Text>layout</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/**
 * Danh sách định nghĩa mẫu văn bản: đúng backend — GET
 * /api/text-templating/template/definitions (ListResult, lọc filter,
 * không phân trang ABP). Mẫu tĩnh chỉ đọc như bảng web.
 */
export default function TextTemplateDefinitionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

  const query = useQuery({
    queryKey: ['text-template-definitions', debouncedFilter],
    queryFn: () => getTextTemplateDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('textTemplateDefinitions.title')}
      subtitle={`${t('textTemplateDefinitions.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('textTemplateDefinitions.searchPlaceholder')}
        testID="text-template-definitions-search"
      />
      <AppNavButton
        title={t('textTemplateDefinitions.createTitle')}
        href={'/text-templating/definitions/form'}
        testID="text-template-definitions-create"
      />
      <View style={{ height: 8 }} />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('textTemplateDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
