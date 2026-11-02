import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
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
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa nhóm Webhook: tạo nhập name + displayName; sửa chỉ đổi
 * displayName (name là key trong path). Nhóm tĩnh không vào được form
 * này (detail đã ẩn nút Sửa).
 */
export default function WebhookGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['webhook-groups', name],
    queryFn: () => getWebhookGroupDefinition(name as string),
    enabled: isEdit,
  });

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['webhook-groups'] });
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
      <AppErrorState message={t('webhookGroups.staticCannotEdit')} onRetry={() => router.back()} />
    );
  }

  const fieldError = (key?: string) => (key && key.startsWith('webhookGroups.') ? t(key) : key);

  return (
    <AppScreen title={isEdit ? t('webhookGroups.editTitle') : t('webhookGroups.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('webhookGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('webhookGroups.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('webhookGroups.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="webhook-group-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookGroups.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('webhookGroups.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="webhook-group-displayName"
            />
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
