import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
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
  getDataByName,
  getMenusAll,
  getRoleMenus,
  getUserMenus,
  setRoleMenus,
  setUserMenus,
} from '../../features/platform/platform-api';
import {
  buildRoleMenuInput,
  buildUserMenuInput,
  coerceStartupMenuId,
  flattenMenuTree,
  normalizeFramework,
  resolveAllotInitial,
  type MenuAllotSubject,
} from '../../features/platform/menu-allotment';
import type { MenuDto } from '../../features/platform/types';
import { getRolesPaged } from '../../features/identity/roles-api';
import { getUsersPaged } from '../../features/identity/api';
import { displayName } from '../../features/identity/types';
import { toggleSelection } from '../../lib/selection';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

/**
 * Phân bổ menu cho user/role — bản mobile của MenuAllotModal web
 * (mở từ bảng Người dùng / Vai trò). Route:
 * /platform/menu-allot?subject=user|role&id=<userId|roleName>&label=<tên hiển thị>
 * Không có param thì tự chọn đối tượng: chuyển subject rồi chọn user/role
 * từ danh sách thật (phân trang, có tìm kiếm) thay vì nhập id tay.
 *
 * Luồng đúng web: chọn framework (gợi ý từ từ điển 'UI Framework') →
 * tải toàn bộ menu của framework + menu đã gán cho đối tượng → tick
 * menu, chọn 1 startup → PUT by-user/by-role. Bỏ tick menu đang là
 * startup thì startup rơi về null; bấm startup ở menu chưa tick thì
 * tick luôn menu đó — giữ bất biến startup luôn nằm trong menu đã gán.
 *
 * Editor được key theo subject|identity|framework nên đổi đối tượng hay
 * framework là remount với trạng thái chọn mới từ dữ liệu đã gán, không
 * đồng bộ state qua effect (tránh cascading renders).
 */

function AllotEditor({
  subject,
  identityId,
  framework,
  allMenus,
  assigned,
}: {
  subject: MenuAllotSubject;
  identityId: string;
  framework: string;
  allMenus: MenuDto[];
  assigned: MenuDto[];
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const initial = useMemo(() => {
    const resolved = resolveAllotInitial(assigned);
    const selectedSet = new Set(resolved.menuIds);
    return {
      selected: selectedSet,
      startup: coerceStartupMenuId(resolved.startupMenuId, selectedSet),
    };
  }, [assigned]);
  const [selected, setSelected] = useState<ReadonlySet<string>>(initial.selected);
  const [startupMenuId, setStartupMenuId] = useState<string | null>(initial.startup);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const rows = useMemo(() => flattenMenuTree(allMenus), [allMenus]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (subject === 'user') {
        return setUserMenus(
          buildUserMenuInput({ userId: identityId, framework, menuIds: selected, startupMenuId }),
        );
      }
      return setRoleMenus(
        buildRoleMenuInput({ roleName: identityId, framework, menuIds: selected, startupMenuId }),
      );
    },
    onSuccess: async () => {
      setSaveError(null);
      setSaveMessage(t('menuAllot.saved'));
      await queryClient.invalidateQueries({ queryKey: ['platform-menus-allot'] });
    },
    onError: (error: unknown) => {
      setSaveMessage(null);
      setSaveError(toApiError(error).message);
    },
  });

  if (rows.length === 0) return <AppEmptyState message={t('menuAllot.empty')} />;

  return (
    <VStack space="sm">
      <Text>
        {t('menuAllot.selectedCount')}: {selected.size}
        {startupMenuId
          ? ` · ${t('menuAllot.startup')}: ${rows.find((r) => r.item.id === startupMenuId)?.item.displayName ?? startupMenuId}`
          : ''}
      </Text>
      <FlatList
        data={rows}
        keyExtractor={({ item }) => item.id}
        renderItem={({ item: row }) => {
          const { item, depth } = row;
          const checked = selected.has(item.id);
          const isStartup = startupMenuId === item.id;
          return (
            <View style={{ marginLeft: depth * 16 }}>
              <Card className="p-4">
                <VStack space="xs">
                  <Pressable
                    onPress={() => {
                      setSelected((prev) => toggleSelection(prev, item.id));
                      if (checked && startupMenuId === item.id) setStartupMenuId(null);
                    }}
                    testID={`menu-allot-menu-${item.id}`}
                  >
                    <Text>
                      {'— '.repeat(depth)}
                      {checked ? '☑ ' : '☐ '}
                      {item.displayName} · {item.name}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      if (!checked) setSelected((prev) => toggleSelection(prev, item.id));
                      setStartupMenuId(item.id);
                    }}
                    testID={`menu-allot-startup-${item.id}`}
                  >
                    <Text>
                      {isStartup ? `★ ${t('menuAllot.startup')}` : `☆ ${t('menuAllot.setStartup')}`}
                    </Text>
                  </Pressable>
                </VStack>
              </Card>
            </View>
          );
        }}
      />
      {saveMessage ? <Text>{saveMessage}</Text> : null}
      {saveError ? <Text>{saveError}</Text> : null}
      <AppButton
        title={t('menuAllot.save')}
        onPress={() => mutation.mutate()}
        loading={mutation.isPending}
        testID="menu-allot-save"
      />
    </VStack>
  );
}

export default function MenuAllotScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ subject?: string; id?: string; label?: string }>();
  const paramSubject =
    params.subject === 'role' ? 'role' : params.subject === 'user' ? 'user' : null;

  const [subject, setSubject] = useState<MenuAllotSubject>(paramSubject ?? 'user');
  const [identityId, setIdentityId] = useState<string>(params.id ?? '');
  const [identityLabel, setIdentityLabel] = useState<string>(params.label ?? '');
  const [identityFilter, setIdentityFilter] = useState('');
  const debouncedFilter = useDebouncedValue(identityFilter);
  const {
    page: identityPage,
    setPage: setIdentityPage,
    skipCount: identitySkipCount,
    maxResultCount: identityMaxResultCount,
    hasMore: hasMoreIdentities,
    loadMore: loadMoreIdentities,
  } = usePagination();
  const [framework, setFramework] = useState('');
  const debouncedFramework = useDebouncedValue(framework);

  const frameworkHint = useQuery({
    queryKey: ['platform-data-ui-framework-hint'],
    queryFn: () => getDataByName('UI Framework'),
  });
  const frameworkNames = useMemo(
    () => (frameworkHint.data?.items ?? []).map((item) => item.name).join(', '),
    [frameworkHint.data],
  );

  // Chuẩn hoá user/role về cùng shape picker { key, label } ngay lúc
  // fetch: key = userId (user) hoặc roleName (role), đúng tham số mà
  // API by-user/by-role yêu cầu — tránh union type ở tầng render.
  const identityQuery = useQuery({
    queryKey: ['platform-menu-allot-identities', subject, debouncedFilter, identityPage],
    queryFn: async () => {
      if (subject === 'user') {
        const page = await getUsersPaged({
          filter: debouncedFilter || undefined,
          skipCount: identitySkipCount,
          maxResultCount: identityMaxResultCount,
        });
        return {
          items: page.items.map((user) => ({ key: user.id, label: displayName(user) })),
          totalCount: page.totalCount,
        };
      }
      const page = await getRolesPaged({
        filter: debouncedFilter || undefined,
        skipCount: identitySkipCount,
        maxResultCount: identityMaxResultCount,
      });
      return {
        items: page.items.map((role) => ({ key: role.name, label: role.name })),
        totalCount: page.totalCount,
      };
    },
    enabled: !paramSubject,
  });

  const readyFramework = normalizeFramework(debouncedFramework);
  const allMenusQuery = useQuery({
    queryKey: ['platform-menus-allot-all', readyFramework],
    queryFn: () => getMenusAll({ framework: readyFramework }),
    enabled: Boolean(identityId && readyFramework),
  });
  const assignedQuery = useQuery({
    queryKey: ['platform-menus-allot-assigned', subject, identityId, readyFramework],
    queryFn: () =>
      subject === 'user'
        ? getUserMenus(identityId, readyFramework as string)
        : getRoleMenus(identityId, readyFramework as string),
    enabled: Boolean(identityId && readyFramework),
  });

  const title = identityLabel ? `${t('menuAllot.title')}: ${identityLabel}` : t('menuAllot.title');

  return (
    <AppScreen title={title} subtitle={t('menuAllot.subtitle')}>
      {!paramSubject ? (
        <VStack space="sm">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <AppButton
              title={t('menuAllot.subjectUser')}
              variant={subject === 'user' ? 'solid' : 'outline'}
              onPress={() => {
                setSubject('user');
                setIdentityId('');
                setIdentityLabel('');
                setIdentityPage(0);
              }}
              testID="menu-allot-subject-user"
            />
            <AppButton
              title={t('menuAllot.subjectRole')}
              variant={subject === 'role' ? 'solid' : 'outline'}
              onPress={() => {
                setSubject('role');
                setIdentityId('');
                setIdentityLabel('');
                setIdentityPage(0);
              }}
              testID="menu-allot-subject-role"
            />
          </View>
          <AppInput
            value={identityFilter}
            onChangeText={(value) => {
              setIdentityFilter(value);
              setIdentityPage(0);
            }}
            placeholder={t('menuAllot.identitySearchPlaceholder')}
            autoCapitalize="none"
          />
          {identityQuery.isPending ? (
            <AppLoading />
          ) : identityQuery.isError ? (
            <AppErrorState
              message={toApiError(identityQuery.error).message}
              onRetry={() => void identityQuery.refetch()}
            />
          ) : (identityQuery.data?.items.length ?? 0) === 0 ? (
            <AppEmptyState message={t('menuAllot.identityEmpty')} />
          ) : (
            <FlatList
              data={identityQuery.data?.items ?? []}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => {
                const isPicked = identityId === item.key;
                return (
                  <Pressable
                    onPress={() => {
                      setIdentityId(item.key);
                      setIdentityLabel(item.label);
                    }}
                  >
                    <Card className="p-4">
                      <Text>
                        {isPicked ? '✓ ' : ''}
                        {item.label}
                      </Text>
                    </Card>
                  </Pressable>
                );
              }}
            />
          )}
          {hasMoreIdentities(identityQuery.data?.totalCount ?? 0) ? (
            <AppButton
              title={t('common.loadMore')}
              variant="outline"
              onPress={loadMoreIdentities}
            />
          ) : null}
        </VStack>
      ) : null}

      <AppInput
        value={framework}
        onChangeText={setFramework}
        placeholder={t('menuAllot.frameworkPlaceholder')}
        autoCapitalize="none"
        testID="menu-allot-framework"
      />
      {frameworkNames ? (
        <Text>
          {t('menuAllot.frameworkHint')}: {frameworkNames}
        </Text>
      ) : null}

      {!identityId ? (
        <AppEmptyState message={t('menuAllot.pickIdentityFirst')} />
      ) : !readyFramework ? (
        <AppEmptyState message={t('menuAllot.enterFrameworkFirst')} />
      ) : allMenusQuery.isPending || assignedQuery.isPending ? (
        <AppLoading />
      ) : allMenusQuery.isError ? (
        <AppErrorState
          message={toApiError(allMenusQuery.error).message}
          onRetry={() => void allMenusQuery.refetch()}
        />
      ) : assignedQuery.isError ? (
        <AppErrorState
          message={toApiError(assignedQuery.error).message}
          onRetry={() => void assignedQuery.refetch()}
        />
      ) : (
        <AllotEditor
          key={`${subject}|${identityId}|${readyFramework}`}
          subject={subject}
          identityId={identityId}
          framework={framework}
          allMenus={allMenusQuery.data?.items ?? []}
          assigned={assignedQuery.data?.items ?? []}
        />
      )}
    </AppScreen>
  );
}
