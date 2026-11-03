import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
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
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

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
  const invalidateAndBack = useInvalidateAndBack(['platform-datas']);
  const { id, parentId: presetParentId } = useRouteParams<{
    id?: string;
    parentId?: string;
  }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useDetailQuery('platform-datas', id, getData);
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
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

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
        <AppFormInput
          control={form.control}
          name="name"
          label={t('platformDataDictionaries.name')}
          placeholder={t('platformDataDictionaries.namePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('platformDataDictionaries.displayName')}
          placeholder={t('platformDataDictionaries.displayNamePlaceholder')}
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('platformDataDictionaries.description')}
          placeholder={t('platformDataDictionaries.descriptionPlaceholder')}
          multiline
        />
        {!isEdit ? (
          <>
            <AppFormInput
              control={form.control}
              name="parentId"
              label={t('platformDataDictionaries.parent')}
              placeholder={t('platformDataDictionaries.parentPlaceholder')}
              autoCapitalize="none"
              fieldError={fieldError}
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
