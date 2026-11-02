import { useRef, useState } from 'react';
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
import { getTextByKey, setText } from '../../../features/localization/localization-api';
import {
  textFormDefaults,
  textFormSchema,
  type TextFormValues,
} from '../../../features/localization/form-schemas';
import { toApiError } from '../../../lib/errors';

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
  const router = useRouter();
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['texts'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && byKey.isPending) return <AppLoading />;
  if (isEdit && byKey.isError) {
    return (
      <AppErrorState
        message={toApiError(byKey.error).message}
        onRetry={() => void byKey.refetch()}
      />
    );
  }

  const fieldError = (key?: string) => (key && key.startsWith('texts.') ? t(key) : key);

  return (
    <AppScreen scrollable title={isEdit ? t('texts.editTitle') : t('texts.createTitle')}>
      <VStack space="md">
        <Controller
          control={form.control}
          name="cultureName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('texts.cultureName')}
              value={field.value}
              onChangeText={(value) => {
                field.onChange(value);
                scheduleCultureReload(value);
              }}
              placeholder={t('texts.cultureNamePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="text-cultureName"
            />
          )}
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
            <Controller
              control={form.control}
              name="resourceName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('texts.resourceName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('texts.resourceNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="text-resourceName"
                />
              )}
            />
            <Controller
              control={form.control}
              name="key"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('texts.key')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('texts.keyPlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="text-key"
                />
              )}
            />
          </>
        )}
        <Controller
          control={form.control}
          name="value"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('texts.value')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('texts.valuePlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="text-value"
            />
          )}
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
