import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createData,
  getData,
  getDatasAll,
  updateData,
} from '../../../features/platform/platform-api';
import {
  dataFormDefaults,
  dataFormSchema,
  type DataFormValues,
} from '../../../features/platform/data-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';

/**
 * Form tạo/sửa từ điển dữ liệu, đúng DTO C#:
 * - Tạo: name/displayName bắt buộc, parentId Guid tùy chọn (để trống =
 *   gốc); màn này còn nhận ?parentId= để tạo con từ nút 'Tạo từ điển
 *   con' ở màn detail (đúng nút 'children' của bảng web).
 * - Sửa: ẩn parentId (UpdateDto không có) và không gửi nó; đổi cha phải
 *   qua màn move riêng (PUT .../move). Code do backend sinh, không nhập.
 */
export default function DataFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, parentId: presetParentId } = useLocalSearchParams<{
    id?: string;
    parentId?: string;
  }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['platform-datas', id],
    queryFn: () => getData(id as string),
    enabled: isEdit,
  });
  const parentsQuery = useQuery({
    queryKey: ['platform-datas-all'],
    queryFn: () => getDatasAll(),
    enabled: !isEdit,
  });

  const form = useForm<DataFormValues>({
    resolver: zodResolver(dataFormSchema()),
    defaultValues: { ...dataFormDefaults, parentId: presetParentId ?? '' },
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName,
          description: detail.data.description ?? '',
          parentId: '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: DataFormValues) => {
      if (isEdit) {
        return updateData(id as string, {
          name: values.name.trim(),
          displayName: values.displayName.trim(),
          description: values.description?.trim() || undefined,
        });
      }
      return createData({
        name: values.name.trim(),
        displayName: values.displayName.trim(),
        description: values.description?.trim() || undefined,
        parentId: values.parentId?.trim() || undefined,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-datas'] });
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

  const fieldError = createFieldError(t, 'platformDataDictionaries');
  const parentsHint =
    parentsQuery.data?.items.map((d) => `${d.displayName} — ${d.id}`).join('\n') ||
    t('platformDataDictionaries.parentsLoading');

  return (
    <AppScreen
      scrollable
      title={t(
        isEdit ? 'platformDataDictionaries.editTitle' : 'platformDataDictionaries.createTitle',
      )}
    >
      <VStack space="sm">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformDataDictionaries.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformDataDictionaries.namePlaceholder')}
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
              label={t('platformDataDictionaries.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformDataDictionaries.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <AppInput
              label={t('platformDataDictionaries.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformDataDictionaries.descriptionPlaceholder')}
              multiline
            />
          )}
        />
        {!isEdit ? (
          <>
            <Controller
              control={form.control}
              name="parentId"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('platformDataDictionaries.parent')}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder={t('platformDataDictionaries.parentPlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                />
              )}
            />
            <Text>
              {t('platformDataDictionaries.parentsHint')}: {parentsHint}
            </Text>
          </>
        ) : null}
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
