import { useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getTextByKey, setText } from '../../../features/localization/localization-api';
import {
  textFormDefaults,
  textFormSchema,
  type TextFormValues,
} from '../../../features/localization/form-schemas';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form đặt văn bản (PUT set-text), đúng modal web:
 * - Tạo: cultureName/resourceName/key đều sửa được (prefill từ form tìm
 *   kiếm: culture đích + tài nguyên đã chọn); submit tạo mới nếu chưa có.
 * - Sửa (edit=1): mở từ một dòng so sánh → sửa bản dịch của culture đích;
 *   resourceName/key khóa lại như modal web; đổi cultureName sẽ tải lại
 *   bản dịch của culture đó (debounce 500ms, tương đương onLanguageChange
 *   của modal web nhưng tránh gọi API theo từng ký tự).
 */
export default function TextFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['texts']);
  const params = useLocalSearchParams<{
    edit?: string;
    cultureName?: string;
    resourceName?: string;
    key?: string;
  }>();
  const isEdit =
    params.edit === '1' && Boolean(params.cultureName && params.resourceName && params.key);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [queryCulture, setQueryCulture] = useState(params.cultureName ?? '');
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Đổi culture ở form sửa → tải lại bản dịch (debounce, tránh gọi API theo từng ký tự). */
  const scheduleCultureReload = (value: string) => {
    if (!isEdit) return;
    const trimmed = value.trim();
    if (!trimmed || trimmed === queryCulture) return;
    if (reloadTimer.current) clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(() => setQueryCulture(trimmed), 500);
  };

  const byKey = useQuery({
    queryKey: ['texts-by-key', queryCulture, params.resourceName, params.key],
    queryFn: () =>
      getTextByKey({
        cultureName: queryCulture,
        resourceName: params.resourceName as string,
        key: params.key as string,
      }),
    enabled: isEdit && Boolean(queryCulture),
  });

  const form = useForm<TextFormValues>({
    resolver: zodResolver(textFormSchema),
    defaultValues: isEdit
      ? {
          ...textFormDefaults,
          cultureName: params.cultureName ?? '',
          resourceName: params.resourceName ?? '',
          key: params.key ?? '',
        }
      : {
          cultureName: params.cultureName ?? '',
          resourceName: params.resourceName ?? '',
          key: '',
          value: '',
        },
    values:
      isEdit && byKey.data
        ? {
            cultureName: queryCulture,
            resourceName: params.resourceName ?? '',
            key: params.key ?? '',
            value: byKey.data.value ?? '',
          }
        : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: TextFormValues) =>
      setText({
        cultureName: values.cultureName,
        resourceName: isEdit ? (params.resourceName as string) : values.resourceName,
        key: isEdit ? (params.key as string) : values.key,
        value: values.value,
      }),
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(byKey);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'texts');

  return (
    <AppScreen scrollable title={isEdit ? t('texts.editTitle') : t('texts.createTitle')}>
      <VStack space="md">
        <AppFormInput
          control={form.control}
          name="cultureName"
          label={t('texts.cultureName')}
          placeholder={t('texts.cultureNamePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
          testID="text-cultureName"
          onChangeExtra={scheduleCultureReload}
        />
        {isEdit ? (
          <>
            <Text>
              {t('texts.resourceName')}: {params.resourceName}
            </Text>
            <Text>
              {t('texts.key')}: {params.key}
            </Text>
          </>
        ) : (
          <>
            <AppFormInput
              control={form.control}
              name="resourceName"
              label={t('texts.resourceName')}
              placeholder={t('texts.resourceNamePlaceholder')}
              autoCapitalize="none"
              testID="text-resourceName"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="key"
              label={t('texts.key')}
              placeholder={t('texts.keyPlaceholder')}
              autoCapitalize="none"
              testID="text-key"
              fieldError={fieldError}
            />
          </>
        )}
        <AppFormInput
          control={form.control}
          name="value"
          label={t('texts.value')}
          placeholder={t('texts.valuePlaceholder')}
          multiline
          testID="text-value"
          fieldError={fieldError}
        />
        <AppFormSubmit
          error={submitError}
          title={isEdit ? t('common.save') : t('common.create')}
          onPress={form.handleSubmit((values) => {
            setSubmitError(null);
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="text-submit"
        />
      </VStack>
    </AppScreen>
  );
}
