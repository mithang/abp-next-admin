import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getTextTemplateDefinitions } from '../../features/text-templating/text-templating-api';
import type { TextTemplateDefinitionDto } from '../../features/text-templating/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

function DefinitionRow({ item }: { item: TextTemplateDefinitionDto }) {
  return (
    <Link href={`/text-templating/definitions/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>static</Text> : null}
            {item.isLayout ? <Text>layout</Text> : null}
          </VStack>
        </Card>
      </Pressable>
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
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const debounced = useDebouncedValue(filter);

  const query = useQuery({
    queryKey: ['text-template-definitions', debounced],
    queryFn: () => getTextTemplateDefinitions({ filter: debounced || undefined }),
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
      <AppButton
        title={t('textTemplateDefinitions.createTitle')}
        onPress={() => router.push('/text-templating/definitions/form')}
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
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}
