import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getRolesPaged } from '../../features/identity/roles-api';
import { roleFlags, type IdentityRoleDto } from '../../features/identity/roles-types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function RoleRow({ role }: { role: IdentityRoleDto }) {
  const { t } = useTranslation();
  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };
  return (
    <Link href={`/roles/${role.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{role.name}</Text>
            {roleFlags(role).map((flag) => (
              <Badge key={flag} variant="default" className="self-start">
                <BadgeText>{flagLabels[flag]}</BadgeText>
              </Badge>
            ))}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function RolesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

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
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('roles.searchPlaceholder')}
        autoCapitalize="none"
        testID="roles-search"
      />
      <AppButton
        title={t('roles.createTitle')}
        onPress={() => router.push('/roles/form')}
        testID="roles-create"
      />
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
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}
