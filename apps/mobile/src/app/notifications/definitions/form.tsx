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
  createNotificationDefinition,
  getNotificationDefinition,
  updateNotificationDefinition,
} from '../../../features/notifications/notifications-api';
import {
  notificationDefinitionFormDefaults,
  notificationDefinitionFormSchema,
  parseEnumNumber,
  type NotificationDefinitionFormValues,
} from '../../../features/notifications/notification-definition-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa định nghĩa thông báo: tạo nhập name (+groupName); sửa chỉ
 * đổi các field còn lại. Enum nhập dạng số theo hint (web dùng Select);
 * providers nhập mỗi dòng một giá trị, gửi đi dạng mảng. Định nghĩa tĩnh
 * không vào được form này (detail đã ẩn nút Sửa).
 */
export default function NotificationDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['notification-definitions', name],
    queryFn: () => getNotificationDefinition(name as string),
    enabled: isEdit,
  });

  const form = useForm<NotificationDefinitionFormValues>({
    resolver: zodResolver(notificationDefinitionFormSchema),
    defaultValues: notificationDefinitionFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          groupName: detail.data.groupName ?? '',
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          allowSubscriptionToClients: detail.data.allowSubscriptionToClients,
          notificationType:
            detail.data.notificationType === undefined ? '' : String(detail.data.notificationType),
          notificationLifetime:
            detail.data.notificationLifetime === undefined
              ? ''
              : String(detail.data.notificationLifetime),
          contentType: detail.data.contentType === undefined ? '' : String(detail.data.contentType),
          providers: (detail.data.providers ?? []).join('\n'),
          template: detail.data.template ?? '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: NotificationDefinitionFormValues) => {
      const providers = (values.providers ?? '')
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);
      const shared = {
        displayName: values.displayName,
        description: values.description || undefined,
        allowSubscriptionToClients: values.allowSubscriptionToClients,
        notificationType: parseEnumNumber(values.notificationType),
        notificationLifetime: parseEnumNumber(values.notificationLifetime),
        contentType: parseEnumNumber(values.contentType),
        providers: providers.length > 0 ? providers : undefined,
        template: values.template || undefined,
      };
      if (isEdit) return updateNotificationDefinition(name as string, shared);
      return createNotificationDefinition({
        ...shared,
        name: values.name,
        groupName: values.groupName || undefined,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-definitions'] });
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
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('notificationDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = (key?: string) =>
    key && key.startsWith('notificationDefinitions.') ? t(key) : key;

  return (
    <AppScreen
      scrollable
      title={
        isEdit ? t('notificationDefinitions.editTitle') : t('notificationDefinitions.createTitle')
      }
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('notificationDefinitions.name')}: {detail.data?.name}
          </Text>
        ) : (
          <>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('notificationDefinitions.name')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('notificationDefinitions.namePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="notification-definition-name"
                />
              )}
            />
            <Controller
              control={form.control}
              name="groupName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('notificationDefinitions.groupName')}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder={t('notificationDefinitions.groupNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="notification-definition-groupName"
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
              label={t('notificationDefinitions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="notification-definition-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationDefinitions.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="notification-definition-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="allowSubscriptionToClients"
          render={({ field }) => (
            <AppSwitchField
              label={t('notificationDefinitions.allowSubscriptionToClients')}
              value={field.value}
              onValueChange={field.onChange}
              layout="stack"
            />
          )}
        />
        <Controller
          control={form.control}
          name="notificationType"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationDefinitions.notificationType')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.notificationTypeHint')}
              keyboardType="numeric"
              error={fieldError(fieldState.error?.message)}
              testID="notification-definition-type"
            />
          )}
        />
        <Controller
          control={form.control}
          name="notificationLifetime"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationDefinitions.notificationLifetime')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.notificationLifetimeHint')}
              keyboardType="numeric"
              error={fieldError(fieldState.error?.message)}
              testID="notification-definition-lifetime"
            />
          )}
        />
        <Controller
          control={form.control}
          name="contentType"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationDefinitions.contentType')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.contentTypeHint')}
              keyboardType="numeric"
              error={fieldError(fieldState.error?.message)}
              testID="notification-definition-contentType"
            />
          )}
        />
        <Controller
          control={form.control}
          name="providers"
          render={({ field }) => (
            <AppInput
              label={t('notificationDefinitions.providers')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.providersPlaceholder')}
              multiline
              autoCapitalize="none"
              testID="notification-definition-providers"
            />
          )}
        />
        <Controller
          control={form.control}
          name="template"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationDefinitions.template')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationDefinitions.templatePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="notification-definition-template"
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
          testID="notification-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
