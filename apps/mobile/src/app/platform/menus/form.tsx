import { useState } from 'react';
import { Switch, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppSelect } from '../../../components/ui/AppSelect';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createMenu,
  getLayoutsPaged,
  getMenu,
  getMenusAll,
  updateMenu,
} from '../../../features/platform/platform-api';
import { orderTreeItems } from '../../../lib/tree-options';
import {
  menuFormDefaults,
  menuFormSchema,
  type MenuFormValues,
} from '../../../features/platform/menu-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa menu, đúng DTO C#:
 * - Tạo: layoutId bắt buộc, chọn qua AppSelect từ bố cục hiện có
 *   (ApiSelect layout ở bảng web); parentId chọn qua AppSelect cây
 *   từ GET /api/platform/menus/all (để trống = gốc), preset từ
 *   ?parentId= (nút "Tạo con" ở detail, đúng nút AddChildren của
 *   bảng web; layoutId preset theo menu cha).
 * - Sửa: ẩn layoutId, hiển thị chỉ đọc, không gửi (UpdateDto không
 *   có layoutId); chính menu đang sửa bị loại khỏi option parentId
 *   (schema cũng chặn, giữ cả 2 lớp như trước).
 * - Meta: drawer web xây form động từ từ điển ràng buộc của layout;
 *   mobile nhập JSON object (mặc định {}), schema kiểm chứng JSON.
 */
export default function MenuFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    id,
    parentId: presetParentId,
    layoutId: presetLayoutId,
  } = useLocalSearchParams<{
    id?: string;
    parentId?: string;
    layoutId?: string;
  }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['platform-menus', id],
    queryFn: () => getMenu(id as string),
    enabled: isEdit,
  });
  const layoutsQuery = useQuery({
    queryKey: ['platform-layouts-hint'],
    queryFn: () => getLayoutsPaged({ maxResultCount: 20 }),
    enabled: !isEdit,
  });
  const menusQuery = useQuery({
    queryKey: ['platform-menus-all'],
    queryFn: () => getMenusAll(),
    enabled: true,
  });

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema(isEdit, id)),
    defaultValues: {
      ...menuFormDefaults,
      parentId: presetParentId ?? '',
      layoutId: presetLayoutId ?? '',
    },
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName,
          path: detail.data.path,
          component: detail.data.component,
          redirect: detail.data.redirect ?? '',
          description: detail.data.description ?? '',
          parentId: detail.data.parentId ?? '',
          isPublic: detail.data.isPublic,
          meta: detail.data.meta ? JSON.stringify(detail.data.meta) : '',
          layoutId: '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: MenuFormValues) => {
      const metaText = (values.meta ?? '').trim();
      const shared = {
        parentId: values.parentId?.trim() || undefined,
        name: values.name.trim(),
        displayName: values.displayName.trim(),
        description: values.description?.trim() || undefined,
        path: values.path.trim(),
        redirect: values.redirect?.trim() || undefined,
        component: values.component.trim(),
        isPublic: values.isPublic,
        meta: metaText ? (JSON.parse(metaText) as Record<string, unknown>) : {},
      };
      if (isEdit) {
        return updateMenu(id as string, shared);
      }
      return createMenu({ ...shared, layoutId: (values.layoutId ?? '').trim() });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-menus'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return (
      <AppErrorState
        message={toApiError(detail.error).message}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  const fieldError = (message?: string) =>
    message && message.startsWith('platformMenus.') ? t(message) : message;
  const layoutOptions = (layoutsQuery.data?.items ?? []).map((l) => ({
    value: l.id,
    label: l.displayName,
  }));
  // Loại chính menu đang sửa khỏi cây cha (schema cũng chặn); preset
  // ?parentId= ngoài danh sách vẫn hiển thị đúng value nhờ fallback
  // của AppSelect, nên không cần thêm option giả.
  const parentOptions = orderTreeItems(menusQuery.data?.items ?? [])
    .filter(({ item }) => item.id !== id)
    .map(({ item, depth }) => ({
      value: item.id,
      label: item.displayName,
      depth,
    }));
  const title = isEdit
    ? t('platformMenus.editTitle')
    : presetParentId
      ? t('platformMenus.createChildTitle')
      : t('platformMenus.createTitle');

  return (
    <AppScreen scrollable title={title}>
      <VStack space="sm">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformMenus.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.namePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformMenus.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="path"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformMenus.path')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.pathPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="component"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformMenus.component')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.componentPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="redirect"
          render={({ field }) => (
            <AppInput
              label={t('platformMenus.redirect')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.redirectPlaceholder')}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <AppInput
              label={t('platformMenus.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.descriptionPlaceholder')}
              multiline
            />
          )}
        />
        <Controller
          control={form.control}
          name="parentId"
          render={({ field, fieldState }) => (
            <AppSelect
              label={t('platformMenus.parentId')}
              value={field.value ?? ''}
              options={parentOptions}
              onChange={field.onChange}
              placeholder={
                menusQuery.isPending ? t('common.loading') : t('platformMenus.parentIdPlaceholder')
              }
              error={fieldError(fieldState.error?.message)}
              clearable
              testID="menu-parent"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <View>
              <Text>{t('platformMenus.isPublic')}</Text>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                accessibilityRole="switch"
              />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="meta"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformMenus.meta')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformMenus.metaPlaceholder')}
              autoCapitalize="none"
              multiline
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        {isEdit ? (
          <Text>
            {t('platformMenus.layoutId')}: {detail.data?.layoutId}
          </Text>
        ) : (
          <>
            <Controller
              control={form.control}
              name="layoutId"
              render={({ field, fieldState }) => (
                <AppSelect
                  label={t('platformMenus.layoutId')}
                  value={field.value ?? ''}
                  options={layoutOptions}
                  onChange={field.onChange}
                  placeholder={
                    layoutsQuery.isPending
                      ? t('platformMenus.layoutLoading')
                      : t('platformMenus.layoutIdPlaceholder')
                  }
                  error={fieldError(fieldState.error?.message)}
                  testID="menu-layout"
                />
              )}
            />
          </>
        )}
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('common.save')}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
          loading={mutation.isPending}
        />
      </VStack>
    </AppScreen>
  );
}
