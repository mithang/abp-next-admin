import { useRouter } from 'expo-router';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createWebhookGroupDefinition,
  getWebhookGroupDefinition,
  updateWebhookGroupDefinition,
} from '../../../features/webhooks/webhooks-api';
import {
  webhookGroupFormDefaults,
  webhookGroupFormSchema,
  type WebhookGroupFormValues,
} from '../../../features/webhooks/webhook-form-schema';
import { useSubmitError } from '../../../lib/use-submit-error';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa nhóm Webhook: tạo nhập name + displayName; sửa chỉ đổi
 * displayName (name là key trong path). Nhóm tĩnh không vào được form
 * này (detail đã ẩn nút Sửa).
 */
export default function WebhookGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['webhook-groups']);
  const { name } = useRouteParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const { error: submitError, onError: handleSubmitError } = useSubmitError();

  const detail = useDetailQuery('webhook-groups', name, getWebhookGroupDefinition);

  const form = useForm<WebhookGroupFormValues>({
    resolver: zodResolver(webhookGroupFormSchema),
    defaultValues: webhookGroupFormDefaults,
    values: detail.data
      ? { name: detail.data.name, displayName: detail.data.displayName ?? '' }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: WebhookGroupFormValues) => {
      if (isEdit) {
        return updateWebhookGroupDefinition(name as string, {
          displayName: values.displayName,
        });
      }
      return createWebhookGroupDefinition({ name: values.name, displayName: values.displayName });
    },
    onSuccess: invalidateAndBack,
    onError: handleSubmitError,
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState message={t('webhookGroups.staticCannotEdit')} onRetry={() => router.back()} />
    );
  }

  const fieldError = createFieldError(t, 'webhookGroups');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('webhookGroups.editTitle') : t('webhookGroups.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('webhookGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('webhookGroups.name')}
            placeholder={t('webhookGroups.namePlaceholder')}
            autoCapitalize="none"
            testID="webhook-group-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('webhookGroups.displayName')}
          placeholder={t('webhookGroups.displayNamePlaceholder')}
          testID="webhook-group-displayName"
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
