import { useState } from 'react';
import { Switch } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../../components/ui/AppScreen';
import { AppFormSelect } from '../../../../components/ui/AppFormSelect';
import { AppFormInput } from '../../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../../../components/ui/AppStates';
import { queryStateElement } from '../../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createDataItem,
  getData,
  updateDataItem,
} from '../../../../features/platform/platform-api';
import {
  dataItemFormDefaults,
  dataItemFormSchema,
  type DataItemFormValues,
} from '../../../../features/platform/data-form-schema';
import { toApiError } from '../../../../lib/errors';
import { createFieldError } from '../../../../lib/field-error';
import { buildDataValueTypeOptions } from '../../../../lib/app-select-options';
import { useInvalidateAndBack } from '../../../../lib/mutation-success';

/**
 * Form tạo/sửa mục từ điển, đúng DTO C#:
 * - Tạo: name bắt buộc. Sửa: name khóa hiển thị dạng chỉ đọc (UpdateDto
 *   không có name, mục xác định bằng name trên URL) và không gửi name.
 * - valueType chọn qua AppSelect 0–5 (String/Number/Boolean/Date/
 *   DateTime/Array, vòng 29 đóng nốt mục này của P2 AppSelect);
 *   Object=6 không nhận như modal web; schema giữ nguyên (chuỗi
 *   '0'–'5') nên giá trị gửi đi không đổi.
 * - defaultValue: allowBeNull=false thì bắt buộc (đúng Validate backend);
 *   kiểm chứng theo kiểu (Number/Boolean/Date) như DatePicker/InputNumber/
 *   Checkbox của web khi đổi về chuỗi.
 */
export default function DataItemFormScreen() {
  const { t } = useTranslation();
  const { dataId, name } = useLocalSearchParams<{ dataId: string; name?: string }>();
  const invalidateAndBack = useInvalidateAndBack(['platform-datas', dataId]);
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['platform-datas', dataId],
    queryFn: () => getData(dataId),
    enabled: Boolean(dataId),
  });
  const existing = detail.data?.items.find((i) => i.name === name);

  const form = useForm<DataItemFormValues>({
    resolver: zodResolver(dataItemFormSchema()),
    defaultValues: dataItemFormDefaults,
    values: existing
      ? {
          name: existing.name,
          displayName: existing.displayName,
          valueType: String(existing.valueType),
          defaultValue: existing.defaultValue ?? '',
          allowBeNull: existing.allowBeNull,
          description: existing.description ?? '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: DataItemFormValues) => {
      const shared = {
        displayName: values.displayName.trim(),
        defaultValue: values.defaultValue?.trim() || undefined,
        description: values.description?.trim() || undefined,
        allowBeNull: values.allowBeNull,
        valueType: Number(values.valueType),
      };
      if (isEdit) {
        return updateDataItem(dataId, name as string, shared);
      }
      return createDataItem(dataId, { ...shared, name: values.name.trim() });
    },
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (queryState) return queryState;
  if (isEdit && !existing) {
    return <AppErrorState message={t('common.empty')} onRetry={() => void detail.refetch()} />;
  }

  const fieldError = createFieldError(t, 'platformDataItems');

  return (
    <AppScreen
      scrollable
      title={t(isEdit ? 'platformDataItems.editTitle' : 'platformDataItems.createTitle')}
    >
      <VStack space="sm">
        {isEdit ? (
          <Text>
            {t('platformDataItems.name')}: {name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('platformDataItems.name')}
            placeholder={t('platformDataItems.namePlaceholder')}
            autoCapitalize="none"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('platformDataItems.displayName')}
          placeholder={t('platformDataItems.displayNamePlaceholder')}
          fieldError={fieldError}
        />
        <AppFormSelect
          control={form.control}
          name="valueType"
          label={t('platformDataItems.valueType')}
          options={buildDataValueTypeOptions()}
          placeholder={t('platformDataItems.valueTypePlaceholder')}
          fieldError={fieldError}
          testID="data-item-value-type"
        />
        <AppFormInput
          control={form.control}
          name="defaultValue"
          label={t('platformDataItems.defaultValue')}
          placeholder={t('platformDataItems.defaultValuePlaceholder')}
          fieldError={fieldError}
        />
        <Controller
          control={form.control}
          name="allowBeNull"
          render={({ field }) => (
            <VStack space="xs">
              <Text>{t('platformDataItems.allowBeNull')}</Text>
              <Switch value={field.value} onValueChange={field.onChange} />
            </VStack>
          )}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('platformDataItems.description')}
          placeholder={t('platformDataItems.descriptionPlaceholder')}
          multiline
        />
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
