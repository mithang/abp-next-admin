import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSelect } from '../../../components/ui/AppFormSelect';
import { orderTreeItems } from '../../../lib/tree-options';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
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
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

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
  const invalidateAndBack = useInvalidateAndBack(['platform-layouts']);
  const { id } = useRouteParams<{ id?: string }>();
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
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'platformLayouts');
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
        <AppFormInput
          control={form.control}
          name="name"
          label={t('platformLayouts.name')}
          placeholder={t('platformLayouts.namePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('platformLayouts.displayName')}
          placeholder={t('platformLayouts.displayNamePlaceholder')}
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="path"
          label={t('platformLayouts.path')}
          placeholder={t('platformLayouts.pathPlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="redirect"
          label={t('platformLayouts.redirect')}
          placeholder={t('platformLayouts.redirectPlaceholder')}
          autoCapitalize="none"
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('platformLayouts.description')}
          placeholder={t('platformLayouts.descriptionPlaceholder')}
          multiline
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
            <AppFormSelect
              control={form.control}
              name="framework"
              label={t('platformLayouts.framework')}
              options={frameworkOptions}
              placeholder={
                frameworksQuery.isPending
                  ? t('platformLayouts.frameworkLoading')
                  : t('platformLayouts.frameworkPlaceholder')
              }
              fieldError={fieldError}
              testID="layout-framework"
            />
            <AppFormSelect
              control={form.control}
              name="dataId"
              label={t('platformLayouts.dataId')}
              options={dataOptions}
              placeholder={
                datasQuery.isPending
                  ? t('platformLayouts.dataIdLoading')
                  : t('platformLayouts.dataIdPlaceholder')
              }
              fieldError={fieldError}
              testID="layout-data"
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
