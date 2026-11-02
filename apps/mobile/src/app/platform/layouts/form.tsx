import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppSelect } from '../../../components/ui/AppSelect';
import { orderTreeItems } from '../../../lib/tree-options';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createLayout,
  getDataByName,
  getDatasAll,
  getLayout,
  updateLayout,
} from '../../../features/platform/platform-api';
import {
  layoutFormDefaults,
  layoutFormSchema,
  type LayoutFormValues,
} from '../../../features/platform/layout-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa bố cục, đúng DTO C#:
 * - Tạo: dataId + framework bắt buộc (modal web ẩn 2 field khi sửa).
 *   dataId chọn qua AppSelect từ cây GET /api/platform/datas/all
 *   (value = id, thụt lề theo parentId); framework chọn qua AppSelect
 *   từ mục của từ điển tên 'UI Framework' (đúng ApiSelect của modal
 *   web, value = name của mục) — vòng 28 thay nhập text kèm gợi ý.
 * - Sửa: ẩn dataId/framework, hiển thị giá trị hiện tại dạng chỉ đọc,
 *   không gửi 2 field này (UpdateDto không có).
 */
export default function LayoutFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['platform-layouts', id],
    queryFn: () => getLayout(id as string),
    enabled: isEdit,
  });
  const datasQuery = useQuery({
    queryKey: ['platform-datas-all'],
    queryFn: () => getDatasAll(),
    enabled: !isEdit,
  });
  const frameworksQuery = useQuery({
    queryKey: ['platform-ui-framework'],
    queryFn: () => getDataByName('UI Framework'),
    enabled: !isEdit,
  });

  const form = useForm<LayoutFormValues>({
    resolver: zodResolver(layoutFormSchema(!isEdit)),
    defaultValues: layoutFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName,
          path: detail.data.path,
          redirect: detail.data.redirect ?? '',
          description: detail.data.description ?? '',
          dataId: '',
          framework: '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: LayoutFormValues) => {
      const shared = {
        name: values.name.trim(),
        displayName: values.displayName.trim(),
        path: values.path.trim(),
        redirect: values.redirect?.trim() || undefined,
        description: values.description?.trim() || undefined,
      };
      if (isEdit) {
        return updateLayout(id as string, shared);
      }
      return createLayout({
        ...shared,
        dataId: (values.dataId ?? '').trim(),
        framework: (values.framework ?? '').trim(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-layouts'] });
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
    message && message.startsWith('platformLayouts.') ? t(message) : message;
  const dataOptions = orderTreeItems(datasQuery.data?.items ?? []).map(({ item, depth }) => ({
    value: item.id,
    label: item.displayName,
    depth,
  }));
  const frameworkOptions = (frameworksQuery.data?.items ?? []).map((i) => ({
    value: i.name,
    label: i.name,
  }));

  return (
    <AppScreen
      scrollable
      title={t(isEdit ? 'platformLayouts.editTitle' : 'platformLayouts.createTitle')}
    >
      <VStack space="sm">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformLayouts.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformLayouts.namePlaceholder')}
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
              label={t('platformLayouts.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformLayouts.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="path"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformLayouts.path')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformLayouts.pathPlaceholder')}
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
              label={t('platformLayouts.redirect')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformLayouts.redirectPlaceholder')}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <AppInput
              label={t('platformLayouts.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformLayouts.descriptionPlaceholder')}
              multiline
            />
          )}
        />
        {isEdit ? (
          <>
            <Text>
              {t('platformLayouts.framework')}: {detail.data?.framework}
            </Text>
            <Text>
              {t('platformLayouts.dataId')}: {detail.data?.dataId}
            </Text>
          </>
        ) : (
          <>
            <Controller
              control={form.control}
              name="framework"
              render={({ field, fieldState }) => (
                <AppSelect
                  label={t('platformLayouts.framework')}
                  value={field.value ?? ''}
                  options={frameworkOptions}
                  onChange={field.onChange}
                  placeholder={
                    frameworksQuery.isPending
                      ? t('platformLayouts.frameworkLoading')
                      : t('platformLayouts.frameworkPlaceholder')
                  }
                  error={fieldError(fieldState.error?.message)}
                  testID="layout-framework"
                />
              )}
            />
            <Controller
              control={form.control}
              name="dataId"
              render={({ field, fieldState }) => (
                <AppSelect
                  label={t('platformLayouts.dataId')}
                  value={field.value ?? ''}
                  options={dataOptions}
                  onChange={field.onChange}
                  placeholder={
                    datasQuery.isPending
                      ? t('platformLayouts.dataIdLoading')
                      : t('platformLayouts.dataIdPlaceholder')
                  }
                  error={fieldError(fieldState.error?.message)}
                  testID="layout-data"
                />
              )}
            />
          </>
        )}
        <AppFormSubmit
          error={submitError}
          title={t('common.save')}
          loading={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
