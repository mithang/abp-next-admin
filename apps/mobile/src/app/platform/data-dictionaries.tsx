import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppTreeRowCard } from '../../components/ui/AppTreeRowCard';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getDatasAll } from '../../features/platform/platform-api';
import type { DataDto } from '../../features/platform/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByNestedId } from '../../lib/list-keys';

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
      <AppTreeRowCard depth={depth}>
        <VStack space="xs">
          <Text>
            {'— '.repeat(depth)}
            {item.displayName}
          </Text>
          <Text>
            {item.name} · {item.code}
          </Text>
        </VStack>
      </AppTreeRowCard>
    </Link>
  );
}

export default function DataDictionariesScreen() {
  const { t } = useTranslation();
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
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformDataDictionaries.searchPlaceholder')}
        testID="platform-datas-search"
      />
      <AppNavButton
        title={t('platformDataDictionaries.createTitle')}
        href={'/platform/data-dictionaries/form'}
        testID="platform-datas-create"
      />
      <AppList
        items={rows}
        {...listQueryProps(query)}
        emptyMessage={t('platformDataDictionaries.empty')}
      >
        <FlatList
          data={rows}
          keyExtractor={keyByNestedId}
          renderItem={({ item }) => <DataRow item={item.item} depth={item.depth} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
