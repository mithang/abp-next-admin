import { useState } from 'react';
import { Switch, View } from 'react-native';
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
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['webhook-definitions'] });
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
        message={t('webhookDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = (key?: string) =>
    key && key.startsWith('webhookDefinitions.') ? t(key) : key;

  return (
    <AppScreen
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
            <Controller
              control={form.control}
              name="groupName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('webhookDefinitions.groupName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('webhookDefinitions.groupNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="webhook-definition-groupName"
                />
              )}
            />
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('webhookDefinitions.name')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('webhookDefinitions.namePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="webhook-definition-name"
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
              label={t('webhookDefinitions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('webhookDefinitions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="webhook-definition-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookDefinitions.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookDefinitions.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="webhook-definition-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <View>
              <Text>{t('webhookDefinitions.isEnabled')}</Text>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                accessibilityRole="switch"
              />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="requiredFeatures"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('webhookDefinitions.requiredFeatures')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('webhookDefinitions.requiredFeaturesPlaceholder')}
              multiline
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="webhook-definition-requiredFeatures"
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
