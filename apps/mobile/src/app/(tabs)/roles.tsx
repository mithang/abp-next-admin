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
import { Badge, BadgeText } from '@/components/ui/badge';
import { getRolesPaged } from '../../features/identity/roles-api';
import { roleFlags, type IdentityRoleDto } from '../../features/identity/roles-types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useListFilter } from '../../lib/use-list-filter';

function RoleRow({ role }: { role: IdentityRoleDto }) {
  const { t } = useTranslation();
  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };
  return (
    <Link href={`/roles/${role.id}`} asChild>
      <AppRowCard>
        <Text>{role.name}</Text>
        {roleFlags(role).map((flag) => (
          <Badge key={flag} variant="default" className="self-start">
            <BadgeText>{flagLabels[flag]}</BadgeText>
          </Badge>
        ))}
      </AppRowCard>
    </Link>
  );
}

export default function RolesScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['roles', debouncedFilter, page],
    queryFn: () =>
      getRolesPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('roles.title')} subtitle={`${t('roles.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('roles.searchPlaceholder')}
        testID="roles-search"
      />
      <AppNavButton title={t('roles.createTitle')} href={'/roles/form'} testID="roles-create" />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('roles.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RoleRow role={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}
