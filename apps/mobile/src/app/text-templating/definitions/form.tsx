import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSwitchField } from '../../../components/ui/AppSwitchField';
import { AppInput } from '../../../components/ui/AppInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createTextTemplateDefinition,
  getTextTemplateDefinition,
  updateTextTemplateDefinition,
} from '../../../features/text-templating/text-templating-api';
import {
  textTemplateDefinitionFormDefaults,
  textTemplateDefinitionFormSchema,
  type TextTemplateDefinitionFormValues,
} from '../../../features/text-templating/text-template-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';

/**
 * Form tạo/sửa định nghĩa mẫu văn bản: tạo nhập name; sửa chỉ đổi các
 * field còn lại + concurrencyStamp (name là key trong path). Mẫu tĩnh
 * không vào được form này (detail đã ẩn nút Sửa).
 */
export default function TextTemplateDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['text-template-definitions', name],
    queryFn: () => getTextTemplateDefinition(name as string),
    enabled: isEdit,
  });

  const form = useForm<TextTemplateDefinitionFormValues>({
    resolver: zodResolver(textTemplateDefinitionFormSchema),
    defaultValues: textTemplateDefinitionFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName ?? '',
          defaultCultureName: detail.data.defaultCultureName ?? '',
          localizationResourceName: detail.data.localizationResourceName ?? '',
          renderEngine: detail.data.renderEngine ?? '',
          isInlineLocalized: detail.data.isInlineLocalized,
          isLayout: detail.data.isLayout,
          layout: detail.data.layout ?? '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: TextTemplateDefinitionFormValues) => {
      const rest = {
        displayName: values.displayName,
        defaultCultureName: values.defaultCultureName || undefined,
        localizationResourceName: values.localizationResourceName || undefined,
        renderEngine: values.renderEngine || undefined,
        isInlineLocalized: values.isInlineLocalized,
        isLayout: values.isLayout,
        layout: values.layout || undefined,
      };
      if (isEdit) {
        return updateTextTemplateDefinition(name as string, {
          ...rest,
          concurrencyStamp: detail.data?.concurrencyStamp as string,
        });
      }
      return createTextTemplateDefinition({ name: values.name, ...rest });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['text-template-definitions'] });
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
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('textTemplateDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = createFieldError(t, 'textTemplateDefinitions');

  return (
    <AppScreen
      scrollable
      title={
        isEdit ? t('textTemplateDefinitions.editTitle') : t('textTemplateDefinitions.createTitle')
      }
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('textTemplateDefinitions.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('textTemplateDefinitions.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('textTemplateDefinitions.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="text-template-definition-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('textTemplateDefinitions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('textTemplateDefinitions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="text-template-definition-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="defaultCultureName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('textTemplateDefinitions.defaultCultureName')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('textTemplateDefinitions.defaultCultureNamePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="text-template-definition-defaultCultureName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="localizationResourceName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('textTemplateDefinitions.localizationResourceName')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('textTemplateDefinitions.localizationResourceNamePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="text-template-definition-localizationResourceName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="renderEngine"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('textTemplateDefinitions.renderEngine')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('textTemplateDefinitions.renderEnginePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="text-template-definition-renderEngine"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isInlineLocalized"
          render={({ field }) => (
            <AppSwitchField
              label={t('textTemplateDefinitions.isInlineLocalized')}
              value={field.value}
              onValueChange={field.onChange}
              layout="stack"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isLayout"
          render={({ field }) => (
            <AppSwitchField
              label={t('textTemplateDefinitions.isLayout')}
              value={field.value}
              onValueChange={field.onChange}
              layout="stack"
            />
          )}
        />
        <Controller
          control={form.control}
          name="layout"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('textTemplateDefinitions.layout')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('textTemplateDefinitions.layoutPlaceholder')}
              multiline
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="text-template-definition-layout"
            />
          )}
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
