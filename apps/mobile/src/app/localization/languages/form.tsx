import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
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
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa ngôn ngữ. Tạo nhập cultureName + uiCultureName + displayName.
 * Sửa: backend chỉ nhận displayName (uiCultureName là create-only) nên 2 ô
 * kia chỉ hiển thị dạng chỉ đọc, không gửi lên — modal web gửi cả formModel
 * nhưng backend bỏ qua 2 trường đó khi update.
 */
export default function LanguageFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['languages']);
  const { name } = useRouteParams<{ name?: string }>();
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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

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
            <AppFormInput
              control={form.control}
              name="cultureName"
              label={t('languages.cultureName')}
              placeholder={t('languages.cultureNamePlaceholder')}
              autoCapitalize="none"
              testID="language-cultureName"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="uiCultureName"
              label={t('languages.uiCultureName')}
              placeholder={t('languages.uiCultureNamePlaceholder')}
              autoCapitalize="none"
              testID="language-uiCultureName"
              fieldError={fieldError}
            />
          </>
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('languages.displayName')}
          placeholder={t('languages.displayNamePlaceholder')}
          testID="language-displayName"
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
          testID="language-submit"
        />
      </VStack>
    </AppScreen>
  );
}
