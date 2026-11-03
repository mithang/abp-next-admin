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
import { getClaimTypesPaged } from '../../features/identity/claim-types-api';
import { valueTypeKey, type IdentityClaimTypeDto } from '../../features/identity/claim-types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';

function ClaimTypeRow({ item }: { item: IdentityClaimTypeDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/claim-types/${item.id}`} asChild>
      <AppRowCard>
        <Text>{item.name}</Text>
        {item.description ? <Text>{item.description}</Text> : null}
        <Badge variant="default" className="self-start">
          <BadgeText>{t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}</BadgeText>
        </Badge>
        {item.required ? (
          <Badge variant="default" className="self-start">
            <BadgeText>{t('claimTypes.required')}</BadgeText>
          </Badge>
        ) : null}
        {item.isStatic ? (
          <Badge variant="default" className="self-start">
            <BadgeText>{t('claimTypes.static')}</BadgeText>
          </Badge>
        ) : null}
      </AppRowCard>
    </Link>
  );
}

export default function ClaimTypesScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['claim-types', debouncedFilter, page],
    queryFn: () =>
      getClaimTypesPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('claimTypes.title')} subtitle={`${t('claimTypes.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('claimTypes.searchPlaceholder')}
        testID="claim-types-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('claimTypes.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <ClaimTypeRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('claimTypes.createTitle')}
        href={'/claim-types/form'}
        testID="claim-types-create"
      />
    </AppScreen>
  );
}
