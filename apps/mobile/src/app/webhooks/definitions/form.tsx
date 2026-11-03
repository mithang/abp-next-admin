import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSwitchField } from '../../../components/ui/AppSwitchField';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createWebhookDefinition,
  getWebhookDefinition,
  updateWebhookDefinition,
} from '../../../features/webhooks/webhooks-api';
import {
  linesToArray,
  webhookDefinitionFormDefaults,
  webhookDefinitionFormSchema,
  type WebhookDefinitionFormValues,
} from '../../../features/webhooks/webhook-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa định nghĩa Webhook: tạo nhập groupName + name; sửa chỉ
 * đổi displayName/description/isEnabled/requiredFeatures (không gửi
 * groupName/name). Định nghĩa tĩnh không vào được form này.
 * requiredFeatures nhập nhiều dòng → mảng, như providers ở các form
 * thông báo (web dùng Select từ feature — mobile chưa có picker).
 */
export default function WebhookDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['webhook-definitions']);
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['webhook-definitions', name],
    queryFn: () => getWebhookDefinition(name as string),
    enabled: isEdit,
  });

  const form = useForm<WebhookDefinitionFormValues>({
    resolver: zodResolver(webhookDefinitionFormSchema),
    defaultValues: webhookDefinitionFormDefaults,
    values: detail.data
      ? {
          groupName: detail.data.groupName,
          name: detail.data.name,
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          isEnabled: detail.data.isEnabled,
          requiredFeatures: (detail.data.requiredFeatures ?? []).join('\n'),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: WebhookDefinitionFormValues) => {
      const requiredFeatures = linesToArray(values.requiredFeatures);
      if (isEdit) {
        return updateWebhookDefinition(name as string, {
          displayName: values.displayName,
          description: values.description || undefined,
          isEnabled: values.isEnabled,
          requiredFeatures,
        });
      }
      return createWebhookDefinition({
        groupName: values.groupName,
        name: values.name,
        displayName: values.displayName,
        description: values.description || undefined,
        isEnabled: values.isEnabled,
        requiredFeatures,
      });
    },
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('webhookDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = createFieldError(t, 'webhookDefinitions');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('webhookDefinitions.editTitle') : t('webhookDefinitions.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <>
            <Text>
              {t('webhookDefinitions.groupName')}: {detail.data?.groupName}
            </Text>
            <Text>
              {t('webhookDefinitions.name')}: {detail.data?.name}
            </Text>
          </>
        ) : (
          <>
            <AppFormInput
              control={form.control}
              name="groupName"
              label={t('webhookDefinitions.groupName')}
              placeholder={t('webhookDefinitions.groupNamePlaceholder')}
              autoCapitalize="none"
              testID="webhook-definition-groupName"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="name"
              label={t('webhookDefinitions.name')}
              placeholder={t('webhookDefinitions.namePlaceholder')}
              autoCapitalize="none"
              testID="webhook-definition-name"
              fieldError={fieldError}
            />
          </>
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('webhookDefinitions.displayName')}
          placeholder={t('webhookDefinitions.displayNamePlaceholder')}
          testID="webhook-definition-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('webhookDefinitions.description')}
          placeholder={t('webhookDefinitions.descriptionPlaceholder')}
          multiline
          testID="webhook-definition-description"
          fieldError={fieldError}
        />
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <AppSwitchField
              label={t('webhookDefinitions.isEnabled')}
              value={field.value}
              onValueChange={field.onChange}
              layout="stack"
            />
          )}
        />
        <AppFormInput
          control={form.control}
          name="requiredFeatures"
          label={t('webhookDefinitions.requiredFeatures')}
          placeholder={t('webhookDefinitions.requiredFeaturesPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="webhook-definition-requiredFeatures"
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
