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
import { getTextTemplateDefinitions } from '../../features/text-templating/text-templating-api';
import type { TextTemplateDefinitionDto } from '../../features/text-templating/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';
import { navPath } from '../../lib/nav-href';

function DefinitionRow({ item }: { item: TextTemplateDefinitionDto }) {
  return (
    <Link href={navPath('/text-templating/definitions', item.name)} asChild>
      <AppRowCard>
        <Text>{item.displayName}</Text>
        <Text>{item.name}</Text>
        <AppOptionalText show={item.isStatic} value="static" />
        <AppOptionalText show={item.isLayout} value="layout" />
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
      <AppSpacer />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('textTemplateDefinitions.empty')}
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
