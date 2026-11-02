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
  createLanguage,
  getLanguage,
  updateLanguage,
} from '../../../features/localization/localization-api';
import {
  languageFormDefaults,
  languageFormSchema,
  type LanguageFormValues,
} from '../../../features/localization/form-schemas';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';

/**
 * Form tạo/sửa ngôn ngữ. Tạo nhập cultureName + uiCultureName + displayName.
 * Sửa: backend chỉ nhận displayName (uiCultureName là create-only) nên 2 ô
 * kia chỉ hiển thị dạng chỉ đọc, không gửi lên — modal web gửi cả formModel
 * nhưng backend bỏ qua 2 trường đó khi update.
 */
export default function LanguageFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['languages', name],
    queryFn: () => getLanguage(name as string),
    enabled: isEdit,
  });

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: languageFormDefaults,
    values: detail.data
      ? {
          cultureName: detail.data.cultureName,
          uiCultureName: detail.data.uiCultureName ?? '',
          displayName: detail.data.displayName ?? '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: LanguageFormValues) => {
      if (isEdit) return updateLanguage(name as string, { displayName: values.displayName });
      return createLanguage({
        cultureName: values.cultureName,
        uiCultureName: values.uiCultureName.trim() ? values.uiCultureName.trim() : undefined,
        displayName: values.displayName,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['languages'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
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

  const fieldError = createFieldError(t, 'languages');

  return (
    <AppScreen scrollable title={isEdit ? t('languages.editTitle') : t('languages.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <>
            <Text>
              {t('languages.cultureName')}: {detail.data?.cultureName}
            </Text>
            {detail.data?.uiCultureName ? (
              <Text>
                {t('languages.uiCultureName')}: {detail.data.uiCultureName}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            <Controller
              control={form.control}
              name="cultureName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('languages.cultureName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('languages.cultureNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="language-cultureName"
                />
              )}
            />
            <Controller
              control={form.control}
              name="uiCultureName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('languages.uiCultureName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('languages.uiCultureNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="language-uiCultureName"
                />
              )}
            />
          </>
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('languages.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('languages.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="language-displayName"
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
          testID="language-submit"
        />
      </VStack>
    </AppScreen>
  );
}
