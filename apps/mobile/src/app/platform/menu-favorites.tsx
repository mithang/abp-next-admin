import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppInput } from '../../components/ui/AppInput';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppEmptyState } from '../../components/ui/AppStates';
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
  updateMyFavoriteMenu,
} from '../../features/platform/platform-api';
import { flattenMenuTree } from '../../features/platform/menu-allotment';
import {
  buildFavoriteCreateInput,
  buildFavoriteUpdateInput,
  favoriteDisplayName,
  isDuplicateFavorite,
  isHexColor,
  type UserFavoriteMenuDto,
} from '../../features/platform/menu-favorites';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { showConfirmDialog } from '../../lib/confirm';
import { useDebouncedValue } from '../../lib/use-debounced-value';

/**
 * Menu yêu thích của tôi — bản mobile của WorkbenchQuickNav web
 * (lưới menu thường dùng trên workbench + modal WorkbenchQuickNavModal).
 *
 * Phạm vi đúng web: xem danh sách, thêm mới, xóa. Web không có UI sửa
 * favorites, nhưng mobile vòng 30 thêm nút Sửa (alias/color/icon qua
 * PUT): đã kiểm chứng service sửa không áp dụng stamp gửi lên (xem
 * menu-favorites.ts), nên UI gửi concurrencyStamp '' — giá trị duy
 * nhất client có thể gửi, không phải stamp giả.
 * Bấm vào một favorite KHÔNG điều hướng: path của nó là route web,
 * không phải route mobile — không tạo điều hướng giả.
 * Xóa truyền item.menuId (id menu), không phải item.id — xem
 * menu-favorites.ts (service tìm bản ghi bằng userId + menuId).
 */

function FavoriteRow({
  item,
  onDelete,
  onEdit,
  deleting,
}: {
  item: UserFavoriteMenuDto;
  onDelete: (item: UserFavoriteMenuDto) => void;
  onEdit: (item: UserFavoriteMenuDto) => void;
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
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AppButton
            title={t('menuFavorites.edit')}
            variant="outline"
            onPress={() => onEdit(item)}
            testID={`menu-favorites-edit-${item.menuId}`}
          />
          <AppButton
            title={t('common.delete')}
            variant="outline"
            onPress={() => onDelete(item)}
            loading={deleting}
            testID={`menu-favorites-delete-${item.menuId}`}
          />
        </View>
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
      <AppList
        items={visibleRows}
        isPending={menusQuery.isPending}
        isError={menusQuery.isError}
        errorMessage={toApiError(menusQuery.error).message}
        onRetry={() => void menusQuery.refetch()}
        emptyMessage={t('menuFavorites.menuEmpty')}
      >
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
      </AppList>
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

function EditFavoriteForm({ item, onDone }: { item: UserFavoriteMenuDto; onDone: () => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [aliasName, setAliasName] = useState(item.aliasName ?? '');
  const [color, setColor] = useState(item.color ?? '');
  const [icon, setIcon] = useState(item.icon ?? '');
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      updateMyFavoriteMenu(
        buildFavoriteUpdateInput({
          menuId: item.menuId,
          // Xem menu-favorites.ts: service sửa không áp dụng stamp
          // gửi lên và DTO không trả stamp về, nên '' là giá trị
          // duy nhất client có thể gửi — không tự bịa stamp.
          concurrencyStamp: '',
          color,
          aliasName,
          icon,
        }),
      ),
    onSuccess: async () => {
      setFormError(null);
      await queryClient.invalidateQueries({ queryKey: ['platform-menu-favorites'] });
      onDone();
    },
    onError: (error: unknown) => setFormError(toApiError(error).message),
  });

  return (
    <Card className="p-4">
      <VStack space="sm">
        <Text>
          {t('menuFavorites.edit')}: {favoriteDisplayName(item)}
        </Text>
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
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AppButton
            title={t('common.save')}
            onPress={() => mutation.mutate()}
            loading={mutation.isPending}
            testID="menu-favorites-save-edit"
          />
          <AppButton
            title={t('common.cancel')}
            variant="outline"
            onPress={onDone}
            testID="menu-favorites-cancel-edit"
          />
        </View>
      </VStack>
    </Card>
  );
}

export default function MenuFavoritesScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [framework, setFramework] = useState('');
  const debouncedFramework = useDebouncedValue(framework);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<UserFavoriteMenuDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserFavoriteMenuDto | null>(null);

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
    showConfirmDialog({
      title: t('menuFavorites.deleteConfirmTitle'),
      message: t('menuFavorites.deleteConfirmMessage'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        setDeleteTarget(item);
        deleteMutation.mutate(item);
      },
    });
  };

  const items = listQuery.data?.items ?? [];

  return (
    <AppScreen title={t('menuFavorites.title')} subtitle={t('menuFavorites.subtitle')}>
      <AppSearchInput
        value={framework}
        onChangeText={setFramework}
        placeholder={t('menuFavorites.frameworkPlaceholder')}
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
      {editingItem ? (
        <EditFavoriteForm item={editingItem} onDone={() => setEditingItem(null)} />
      ) : null}
      <AppList
        items={items}
        isPending={listQuery.isPending}
        isError={listQuery.isError}
        errorMessage={toApiError(listQuery.error).message}
        onRetry={() => void listQuery.refetch()}
        emptyMessage={t('menuFavorites.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FavoriteRow
              item={item}
              onDelete={confirmDelete}
              onEdit={setEditingItem}
              deleting={deleteMutation.isPending && deleteTarget?.menuId === item.menuId}
            />
          )}
          {...listRefreshProps(listQuery)}
        />
      </AppList>
    </AppScreen>
  );
}
