import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormSwitch } from '../../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
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
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa định nghĩa mẫu văn bản: tạo nhập name; sửa chỉ đổi các
 * field còn lại + concurrencyStamp (name là key trong path). Mẫu tĩnh
 * không vào được form này (detail đã ẩn nút Sửa).
 */
export default function TextTemplateDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['text-template-definitions']);
  const { name } = useRouteParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useDetailQuery('text-template-definitions', name, getTextTemplateDefinition);

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
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
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
          <AppFormInput
            control={form.control}
            name="name"
            label={t('textTemplateDefinitions.name')}
            placeholder={t('textTemplateDefinitions.namePlaceholder')}
            autoCapitalize="none"
            testID="text-template-definition-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('textTemplateDefinitions.displayName')}
          placeholder={t('textTemplateDefinitions.displayNamePlaceholder')}
          testID="text-template-definition-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="defaultCultureName"
          label={t('textTemplateDefinitions.defaultCultureName')}
          placeholder={t('textTemplateDefinitions.defaultCultureNamePlaceholder')}
          autoCapitalize="none"
          testID="text-template-definition-defaultCultureName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="localizationResourceName"
          label={t('textTemplateDefinitions.localizationResourceName')}
          placeholder={t('textTemplateDefinitions.localizationResourceNamePlaceholder')}
          autoCapitalize="none"
          testID="text-template-definition-localizationResourceName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="renderEngine"
          label={t('textTemplateDefinitions.renderEngine')}
          placeholder={t('textTemplateDefinitions.renderEnginePlaceholder')}
          autoCapitalize="none"
          testID="text-template-definition-renderEngine"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="isInlineLocalized"
          label={t('textTemplateDefinitions.isInlineLocalized')}
          layout="stack"
        />
        <AppFormSwitch
          control={form.control}
          name="isLayout"
          label={t('textTemplateDefinitions.isLayout')}
          layout="stack"
        />
        <AppFormInput
          control={form.control}
          name="layout"
          label={t('textTemplateDefinitions.layout')}
          placeholder={t('textTemplateDefinitions.layoutPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="text-template-definition-layout"
          fieldError={fieldError}
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
