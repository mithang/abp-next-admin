import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppInput } from '../../components/ui/AppInput';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getLayoutsPaged, getMenusAll } from '../../features/platform/platform-api';
import type { MenuDto } from '../../features/platform/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useDebouncedValue } from '../../lib/use-debounced-value';

/**
 * Danh sách menu: đúng bảng web — GET /api/platform/menus/all rồi dựng
 * cây theo parentId (không dùng phân trang server; web cũng phân trang
 * client trên cây đó). Màn mobile trải cây phẳng có thụt lề theo độ sâu,
 * lọc layoutId + filter qua API (đúng form lọc của bảng web).
 */
function flattenTree(items: MenuDto[]): { item: MenuDto; depth: number }[] {
  const children = new Map<string | null, MenuDto[]>();
  const ids = new Set(items.map((i) => i.id));
  for (const item of items) {
    const parent = item.parentId && ids.has(item.parentId) ? item.parentId : null;
    const list = children.get(parent) ?? [];
    list.push(item);
    children.set(parent, list);
  }
  const out: { item: MenuDto; depth: number }[] = [];
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

function MenuRow({ item, depth }: { item: MenuDto; depth: number }) {
  return (
    <Link href={`/platform/menus/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <View style={{ marginLeft: depth * 16 }}>
          <Card className="p-4">
            <VStack space="xs">
              <Text>
                {'— '.repeat(depth)}
                {item.displayName}
              </Text>
              <Text>
                {item.name} · {item.path} · {item.component}
              </Text>
              {item.isPublic ? <Text>Public</Text> : null}
            </VStack>
          </Card>
        </View>
      </Pressable>
    </Link>
  );
}

export default function MenusScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [layoutId, setLayoutId] = useState('');
  const debounced = useDebouncedValue({ filter, layoutId });

  const query = useQuery({
    queryKey: ['platform-menus-all', debounced],
    queryFn: () =>
      getMenusAll({
        filter: debounced.filter || undefined,
        layoutId: debounced.layoutId || undefined,
      }),
  });
  const layoutsQuery = useQuery({
    queryKey: ['platform-layouts-hint'],
    queryFn: () => getLayoutsPaged({ maxResultCount: 20 }),
  });

  const rows = useMemo(() => flattenTree(query.data?.items ?? []), [query.data]);
  const total = query.data?.items.length ?? 0;
  const layoutsHint =
    layoutsQuery.data?.items.map((l) => `${l.displayName} — ${l.id}`).join('\n') ||
    t('platformMenus.layoutLoading');

  return (
    <AppScreen title={t('platformMenus.title')} subtitle={`${t('platformMenus.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformMenus.searchPlaceholder')}
        testID="platform-menus-search"
      />
      <AppInput
        value={layoutId}
        onChangeText={setLayoutId}
        placeholder={t('platformMenus.layoutPlaceholder')}
        autoCapitalize="none"
      />
      <Text>
        {t('platformMenus.layoutHint')}: {layoutsHint}
      </Text>
      <AppNavButton
        title={t('platformMenus.createTitle')}
        href={'/platform/menus/form'}
        testID="platform-menus-create"
      />
      <AppNavButton
        title={t('menuAllot.title')}
        href={'/platform/menu-allot'}
        variant="outline"
        testID="platform-menus-allot"
      />
      <AppNavButton
        title={t('menuFavorites.title')}
        href={'/platform/menu-favorites'}
        variant="outline"
        testID="platform-menus-favorites"
      />
      <AppList
        items={rows}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('platformMenus.empty')}
      >
        <FlatList
          data={rows}
          keyExtractor={({ item }) => item.id}
          renderItem={({ item }) => <MenuRow item={item.item} depth={item.depth} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
