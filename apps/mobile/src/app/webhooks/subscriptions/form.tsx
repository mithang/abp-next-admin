import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormSwitch } from '../../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createWebhookSubscription,
  getAvailableWebhooks,
  getWebhookSubscription,
  updateWebhookSubscription,
} from '../../../features/webhooks/webhooks-api';
import {
  linesToArray,
  parseHeadersJson,
  parseTimeoutDuration,
  webhookSubscriptionFormDefaults,
  webhookSubscriptionFormSchema,
  type WebhookSubscriptionFormValues,
} from '../../../features/webhooks/webhook-form-schema';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa đăng ký Webhook, đúng DTO C#:
 * - webhookUri bắt buộc; webhooks nhập nhiều dòng → mảng (modal web
 *   chọn từ GET .../subscriptions/availables — màn này hiển thị gợi ý
 *   từ API đó, chưa có picker); headers nhập JSON object (mặc định {});
 *   timeoutDuration nhập text số nguyên >= 0.
 * - Sửa gửi concurrencyStamp từ DTO (UpdateDto có field này, khác
 *   nhóm/định nghĩa). Secret dùng ô nhập ẩn; sửa nạp sẵn giá trị từ
 *   DTO nên lưu không đổi vẫn giữ secret cũ.
 */
export default function WebhookSubscriptionFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['webhook-subscriptions']);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['webhook-subscriptions', id],
    queryFn: () => getWebhookSubscription(id as string),
    enabled: isEdit,
  });
  const availablesQuery = useQuery({
    queryKey: ['webhook-availables'],
    queryFn: () => getAvailableWebhooks(),
  });

  const form = useForm<WebhookSubscriptionFormValues>({
    resolver: zodResolver(webhookSubscriptionFormSchema),
    defaultValues: webhookSubscriptionFormDefaults,
    values: detail.data
      ? {
          webhookUri: detail.data.webhookUri,
          secret: detail.data.secret ?? '',
          description: detail.data.description ?? '',
          timeoutDuration:
            detail.data.timeoutDuration !== undefined ? String(detail.data.timeoutDuration) : '',
          isActive: detail.data.isActive,
          webhooks: (detail.data.webhooks ?? []).join('\n'),
          headers: JSON.stringify(detail.data.headers ?? {}),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: WebhookSubscriptionFormValues) => {
      const input = {
        webhookUri: values.webhookUri,
        secret: values.secret || undefined,
        description: values.description || undefined,
        timeoutDuration: parseTimeoutDuration(values.timeoutDuration),
        isActive: values.isActive,
        webhooks: linesToArray(values.webhooks),
        headers: parseHeadersJson(values.headers),
      };
      if (isEdit) {
        return updateWebhookSubscription(id as string, {
          ...input,
          concurrencyStamp: detail.data?.concurrencyStamp as string,
        });
      }
      return createWebhookSubscription(input);
    },
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'webhookSubscriptions');
  const availableHint =
    availablesQuery.data?.items.flatMap((g) => g.webhooks.map((w) => w.name)).join(', ') || '';

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('webhookSubscriptions.editTitle') : t('webhookSubscriptions.createTitle')}
    >
      <VStack space="md">
        <AppFormInput
          control={form.control}
          name="webhookUri"
          label={t('webhookSubscriptions.webhookUri')}
          placeholder={t('webhookSubscriptions.webhookUriPlaceholder')}
          autoCapitalize="none"
          testID="webhook-subscription-webhookUri"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="secret"
          label={t('webhookSubscriptions.secret')}
          placeholder={t('webhookSubscriptions.secretPlaceholder')}
          autoCapitalize="none"
          secureTextEntry
          testID="webhook-subscription-secret"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('webhookSubscriptions.description')}
          placeholder={t('webhookSubscriptions.descriptionPlaceholder')}
          multiline
          testID="webhook-subscription-description"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="isActive"
          label={t('webhookSubscriptions.isActive')}
          layout="stack"
        />
        <AppFormInput
          control={form.control}
          name="timeoutDuration"
          label={t('webhookSubscriptions.timeoutDuration')}
          placeholder={t('webhookSubscriptions.timeoutDurationPlaceholder')}
          keyboardType="numeric"
          testID="webhook-subscription-timeoutDuration"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="webhooks"
          label={t('webhookSubscriptions.webhooks')}
          placeholder={t('webhookSubscriptions.webhooksPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="webhook-subscription-webhooks"
          fieldError={fieldError}
        />
        {availableHint ? (
          <Text>
            {t('webhookSubscriptions.availableHint')}: {availableHint}
          </Text>
        ) : null}
        <AppFormInput
          control={form.control}
          name="headers"
          label={t('webhookSubscriptions.headers')}
          placeholder={t('webhookSubscriptions.headersPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="webhook-subscription-headers"
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
