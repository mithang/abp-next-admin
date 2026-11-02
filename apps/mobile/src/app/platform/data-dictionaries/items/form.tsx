import { useState } from 'react';
import { Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../../components/ui/AppScreen';
import { AppSelect } from '../../../../components/ui/AppSelect';
import { AppInput } from '../../../../components/ui/AppInput';
import { AppButton } from '../../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../../components/ui/AppStates';
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
import { buildDataValueTypeOptions } from '../../../../lib/app-select-options';

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { dataId, name } = useLocalSearchParams<{ dataId: string; name?: string }>();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-datas', dataId] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  if (detail.isPending) return <AppLoading />;
  if (detail.isError) {
    return (
      <AppErrorState
        message={toApiError(detail.error).message}
        onRetry={() => void detail.refetch()}
      />
    );
  }
  if (isEdit && !existing) {
    return <AppErrorState message={t('common.empty')} onRetry={() => void detail.refetch()} />;
  }

  const fieldError = (message?: string) =>
    message && message.startsWith('platformDataItems.') ? t(message) : message;

  return (
    <AppScreen title={t(isEdit ? 'platformDataItems.editTitle' : 'platformDataItems.createTitle')}>
      <VStack space="sm">
        {isEdit ? (
          <Text>
            {t('platformDataItems.name')}: {name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('platformDataItems.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('platformDataItems.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformDataItems.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('platformDataItems.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="valueType"
          render={({ field, fieldState }) => (
            <AppSelect
              label={t('platformDataItems.valueType')}
              value={field.value}
              options={buildDataValueTypeOptions()}
              onChange={field.onChange}
              placeholder={t('platformDataItems.valueTypePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="data-item-value-type"
            />
          )}
        />
        <Controller
          control={form.control}
          name="defaultValue"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('platformDataItems.defaultValue')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformDataItems.defaultValuePlaceholder')}
              error={fieldError(fieldState.error?.message)}
            />
          )}
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
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <AppInput
              label={t('platformDataItems.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('platformDataItems.descriptionPlaceholder')}
              multiline
            />
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
