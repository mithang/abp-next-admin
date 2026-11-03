import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { Text } from '@/components/ui/text';
import { AppBadge } from '../../components/ui/AppBadge';
import { getUsersPaged } from '../../features/identity/api';
import { displayName, type IdentityUserDto } from '../../features/identity/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';

function UserRow({ user }: { user: IdentityUserDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/users/${user.id}`} asChild>
      <AppRowCard>
        <Text>{displayName(user)}</Text>
        <Text>
          {user.userName} · {user.email}
        </Text>
        <AppBadge
          variant={user.isActive ? 'default' : 'destructive'}
          label={user.isActive ? t('users.active') : t('users.inactive')}
        />
      </AppRowCard>
    </Link>
  );
}

export default function UsersScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['users', debouncedFilter, page],
    queryFn: () =>
      getUsersPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('users.title')} subtitle={`${t('users.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('users.searchPlaceholder')}
        testID="users-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('users.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <UserRow user={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
