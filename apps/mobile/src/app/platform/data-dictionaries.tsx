import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getDatasAll } from '../../features/platform/platform-api';
import type { DataDto } from '../../features/platform/types';
import { toApiError } from '../../lib/errors';

/**
 * Danh sách từ điển dữ liệu: đúng bảng web — GET /api/platform/datas/all
 * rồi dựng cây theo parentId (không dùng phân trang server). Màn mobile
 * trải cây thành danh sách phẳng có thụt lề theo độ sâu; lọc theo tên/
 * tên hiển thị/mã ngay trên client.
 */
function flattenTree(items: DataDto[]): { item: DataDto; depth: number }[] {
  const children = new Map<string | null, DataDto[]>();
  const ids = new Set(items.map((i) => i.id));
  for (const item of items) {
    const parent = item.parentId && ids.has(item.parentId) ? item.parentId : null;
    const list = children.get(parent) ?? [];
    list.push(item);
    children.set(parent, list);
  }
  const out: { item: DataDto; depth: number }[] = [];
  const visit = (parent: string | null, depth: number, seen: Set<string>) => {
    for (const item of children.get(parent) ?? []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push({ item, depth });
      visit(item.id, depth + 1, seen);
    }
  };
  visit(null, 0, new Set());
  return out;
}

function DataRow({ item, depth }: { item: DataDto; depth: number }) {
  return (
    <Link href={`/platform/data-dictionaries/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <View style={{ marginLeft: depth * 16 }}>
          <Card className="p-4">
            <VStack space="xs">
              <Text>
                {'— '.repeat(depth)}
                {item.displayName}
              </Text>
              <Text>
                {item.name} · {item.code}
              </Text>
            </VStack>
          </Card>
        </View>
      </Pressable>
    </Link>
  );
}

export default function DataDictionariesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');

  const query = useQuery({ queryKey: ['platform-datas-all'], queryFn: () => getDatasAll() });

  const rows = useMemo(() => {
    const all = query.data?.items ?? [];
    const flat = flattenTree(all);
    const needle = filter.trim().toLowerCase();
    if (!needle) return flat;
    return flat.filter(
      ({ item }) =>
        item.name.toLowerCase().includes(needle) ||
        item.displayName.toLowerCase().includes(needle) ||
        item.code.toLowerCase().includes(needle),
    );
  }, [query.data, filter]);

  const total = query.data?.items.length ?? 0;

  return (
    <AppScreen
      title={t('platformDataDictionaries.title')}
      subtitle={`${t('platformDataDictionaries.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformDataDictionaries.searchPlaceholder')}
        autoCapitalize="none"
        testID="platform-datas-search"
      />
      <AppButton
        title={t('platformDataDictionaries.createTitle')}
        onPress={() => router.push('/platform/data-dictionaries/form')}
        testID="platform-datas-create"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : rows.length === 0 ? (
        <AppEmptyState message={t('platformDataDictionaries.empty')} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={({ item }) => item.id}
          renderItem={({ item }) => <DataRow item={item.item} depth={item.depth} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
    </AppScreen>
  );
}
