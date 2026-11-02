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
import { createFieldError } from '../../../lib/field-error';

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
  const router = useRouter();
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['webhook-subscriptions'] });
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

  const fieldError = createFieldError(t, 'webhookSubscriptions');
  const availableHint =
    availablesQuery.data?.items.flatMap((g) => g.webhooks.map((w) => w.name)).join(', ') || '';

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('webhookSubscriptions.editTitle') : t('webhookSubscriptions.createTitle')}
    >
      <VStack space="md">
        <Controller
          control={form.control}
          name="webhookUri"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookSubscriptions.webhookUri')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('webhookSubscriptions.webhookUriPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="webhook-subscription-webhookUri"
            />
          )}
        />
        <Controller
          control={form.control}
          name="secret"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookSubscriptions.secret')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookSubscriptions.secretPlaceholder')}
              autoCapitalize="none"
              secureTextEntry
              error={fieldError(fieldState.error?.message)}
              testID="webhook-subscription-secret"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookSubscriptions.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookSubscriptions.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="webhook-subscription-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <AppSwitchField
              label={t('webhookSubscriptions.isActive')}
              value={field.value}
              onValueChange={field.onChange}
              layout="stack"
            />
          )}
        />
        <Controller
          control={form.control}
          name="timeoutDuration"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookSubscriptions.timeoutDuration')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookSubscriptions.timeoutDurationPlaceholder')}
              keyboardType="numeric"
              error={fieldError(fieldState.error?.message)}
              testID="webhook-subscription-timeoutDuration"
            />
          )}
        />
        <Controller
          control={form.control}
          name="webhooks"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookSubscriptions.webhooks')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookSubscriptions.webhooksPlaceholder')}
              multiline
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="webhook-subscription-webhooks"
            />
          )}
        />
        {availableHint ? (
          <Text>
            {t('webhookSubscriptions.availableHint')}: {availableHint}
          </Text>
        ) : null}
        <Controller
          control={form.control}
          name="headers"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookSubscriptions.headers')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookSubscriptions.headersPlaceholder')}
              multiline
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="webhook-subscription-headers"
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
