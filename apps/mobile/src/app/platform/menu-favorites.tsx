import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  createMyFavoriteMenu,
  deleteMyFavoriteMenu,
  getDataByName,
  getMenusAll,
  getMyFavoriteMenus,
} from '../../features/platform/platform-api';
import { flattenMenuTree } from '../../features/platform/menu-allotment';
import {
  buildFavoriteCreateInput,
  favoriteDisplayName,
  isDuplicateFavorite,
  isHexColor,
  type UserFavoriteMenuDto,
} from '../../features/platform/menu-favorites';
import { toApiError } from '../../lib/errors';

/**
 * Menu yêu thích của tôi — bản mobile của WorkbenchQuickNav web
 * (lưới menu thường dùng trên workbench + modal WorkbenchQuickNavModal).
 *
 * Phạm vi đúng web: xem danh sách, thêm mới, xóa. Web không có UI sửa
 * favorites (xem menu-favorites.ts: DTO trả về không mang stamp), nên
 * màn này cũng không có nút sửa — chỉ API update đã test route/body.
 * Bấm vào một favorite KHÔNG điều hướng: path của nó là route web,
 * không phải route mobile — không tạo điều hướng giả.
 * Xóa truyền item.menuId (id menu), không phải item.id — xem
 * menu-favorites.ts (service tìm bản ghi bằng userId + menuId).
 */

function FavoriteRow({
  item,
  onDelete,
  deleting,
}: {
  item: UserFavoriteMenuDto;
  onDelete: (item: UserFavoriteMenuDto) => void;
  deleting: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Card className="p-4">
      <VStack space="xs">
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {isHexColor(item.color) ? (
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                backgroundColor: (item.color as string).trim(),
              }}
            />
          ) : null}
          <Text>{favoriteDisplayName(item)}</Text>
        </View>
        <Text>
          {item.name} · {item.path}
          {item.framework ? ` · ${item.framework}` : ''}
        </Text>
        {item.icon ? <Text>{item.icon}</Text> : null}
        <AppButton
          title={t('common.delete')}
          variant="outline"
          onPress={() => onDelete(item)}
          loading={deleting}
          testID={`menu-favorites-delete-${item.menuId}`}
        />
      </VStack>
    </Card>
  );
}

function AddFavoriteForm({
  framework,
  existing,
}: {
  framework: string;
  existing: UserFavoriteMenuDto[];
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [menuFilter, setMenuFilter] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [aliasName, setAliasName] = useState('');
  const [color, setColor] = useState('#000000');
  const [icon, setIcon] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const menusQuery = useQuery({
    queryKey: ['platform-menu-favorites-menus', framework],
    queryFn: () => getMenusAll({ framework }),
  });
  const rows = useMemo(() => flattenMenuTree(menusQuery.data?.items ?? []), [menusQuery.data]);
  const visibleRows = useMemo(() => {
    const needle = menuFilter.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (row) =>
        row.item.displayName.toLowerCase().includes(needle) ||
        row.item.name.toLowerCase().includes(needle),
    );
  }, [rows, menuFilter]);

  const mutation = useMutation({
    mutationFn: () => {
      const input = buildFavoriteCreateInput({
        framework,
        menuId: selectedMenuId,
        color,
        aliasName,
        icon,
      });
      if (!input.menuId) throw new Error(t('menuFavorites.pickMenuFirst'));
      if (isDuplicateFavorite(existing, input.menuId, input.framework)) {
        throw new Error(t('menuFavorites.duplicate'));
      }
      return createMyFavoriteMenu(input);
    },
    onSuccess: async () => {
      setFormError(null);
      setFormMessage(t('menuFavorites.created'));
      setSelectedMenuId('');
      setAliasName('');
      setIcon('');
      await queryClient.invalidateQueries({ queryKey: ['platform-menu-favorites'] });
    },
    onError: (error: unknown) => {
      setFormMessage(null);
      setFormError(toApiError(error).message);
    },
  });

  return (
    <VStack space="sm">
      <AppInput
        value={menuFilter}
        onChangeText={setMenuFilter}
        placeholder={t('menuFavorites.menuSearchPlaceholder')}
        autoCapitalize="none"
      />
      {menusQuery.isPending ? (
        <AppLoading />
      ) : menusQuery.isError ? (
        <AppErrorState
          message={toApiError(menusQuery.error).message}
          onRetry={() => void menusQuery.refetch()}
        />
      ) : visibleRows.length === 0 ? (
        <AppEmptyState message={t('menuFavorites.menuEmpty')} />
      ) : (
        <FlatList
          data={visibleRows}
          keyExtractor={({ item }) => item.id}
          renderItem={({ item: row }) => {
            const picked = selectedMenuId === row.item.id;
            return (
              <Pressable onPress={() => setSelectedMenuId(row.item.id)}>
                <View style={{ marginLeft: row.depth * 16 }}>
                  <Card className="p-4">
                    <Text>
                      {'— '.repeat(row.depth)}
                      {picked ? '✓ ' : ''}
                      {row.item.displayName} · {row.item.name}
                    </Text>
                  </Card>
                </View>
              </Pressable>
            );
          }}
        />
      )}
      <AppInput
        value={aliasName}
        onChangeText={setAliasName}
        placeholder={t('menuFavorites.aliasPlaceholder')}
        autoCapitalize="none"
      />
      <AppInput
        value={color}
        onChangeText={setColor}
        placeholder={t('menuFavorites.colorPlaceholder')}
        autoCapitalize="none"
      />
      <AppInput
        value={icon}
        onChangeText={setIcon}
        placeholder={t('menuFavorites.iconPlaceholder')}
        autoCapitalize="none"
      />
      {formError ? <Text>{formError}</Text> : null}
      {formMessage ? <Text>{formMessage}</Text> : null}
      <AppButton
        title={t('menuFavorites.create')}
        onPress={() => mutation.mutate()}
        loading={mutation.isPending}
        testID="menu-favorites-create"
      />
    </VStack>
  );
}

export default function MenuFavoritesScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [framework, setFramework] = useState('');
  const [debouncedFramework, setDebouncedFramework] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserFavoriteMenuDto | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFramework(framework), 400);
    return () => clearTimeout(timer);
  }, [framework]);

  const frameworkHint = useQuery({
    queryKey: ['platform-data-ui-framework-hint'],
    queryFn: () => getDataByName('UI Framework'),
  });
  const frameworkNames = useMemo(
    () => (frameworkHint.data?.items ?? []).map((item) => item.name).join(', '),
    [frameworkHint.data],
  );

  const listQuery = useQuery({
    queryKey: ['platform-menu-favorites', debouncedFramework],
    queryFn: () => getMyFavoriteMenus(debouncedFramework || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (item: UserFavoriteMenuDto) => deleteMyFavoriteMenu(item.menuId),
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ['platform-menu-favorites'] });
    },
    onError: () => setDeleteTarget(null),
  });

  const confirmDelete = (item: UserFavoriteMenuDto) => {
    Alert.alert(t('menuFavorites.deleteConfirmTitle'), t('menuFavorites.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          setDeleteTarget(item);
          deleteMutation.mutate(item);
        },
      },
    ]);
  };

  const items = listQuery.data?.items ?? [];

  return (
    <AppScreen title={t('menuFavorites.title')} subtitle={t('menuFavorites.subtitle')}>
      <AppInput
        value={framework}
        onChangeText={setFramework}
        placeholder={t('menuFavorites.frameworkPlaceholder')}
        autoCapitalize="none"
        testID="menu-favorites-framework"
      />
      {frameworkNames ? (
        <Text>
          {t('menuFavorites.frameworkHint')}: {frameworkNames}
        </Text>
      ) : null}
      <AppButton
        title={showForm ? t('menuFavorites.hideForm') : t('menuFavorites.showForm')}
        variant="outline"
        onPress={() => setShowForm((prev) => !prev)}
        testID="menu-favorites-toggle-form"
      />
      {showForm ? (
        !debouncedFramework.trim() ? (
          <AppEmptyState message={t('menuFavorites.enterFrameworkFirst')} />
        ) : (
          <AddFavoriteForm framework={debouncedFramework.trim()} existing={items} />
        )
      ) : null}
      {listQuery.isPending ? (
        <AppLoading />
      ) : listQuery.isError ? (
        <AppErrorState
          message={toApiError(listQuery.error).message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('menuFavorites.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FavoriteRow
              item={item}
              onDelete={confirmDelete}
              deleting={deleteMutation.isPending && deleteTarget?.menuId === item.menuId}
            />
          )}
          refreshing={listQuery.isFetching}
          onRefresh={() => void listQuery.refetch()}
        />
      )}
    </AppScreen>
  );
}
