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
import { createNotificationGroup, getNotificationGroup, updateNotificationGroup } from '../../../features/notifications/notifications-api';
import { notificationGroupFormDefaults, notificationGroupFormSchema, type NotificationGroupFormValues } from '../../../features/notifications/notification-group-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa nhóm thông báo: tạo nhập name + displayName; sửa chỉ đổi
 * displayName/description/allowSubscriptionToClients. Nhóm tĩnh không vào
 * được form này (detail đã ẩn nút Sửa).
 */
export default function NotificationGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({ queryKey: ['notification-groups', name], queryFn: () => getNotificationGroup(name as string), enabled: isEdit });

  const form = useForm<NotificationGroupFormValues>({
    resolver: zodResolver(notificationGroupFormSchema),
    defaultValues: notificationGroupFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          allowSubscriptionToClients: detail.data.allowSubscriptionToClients,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: NotificationGroupFormValues) => {
      if (isEdit) {
        return updateNotificationGroup(name as string, {
          displayName: values.displayName,
          description: values.description || undefined,
          allowSubscriptionToClients: values.allowSubscriptionToClients,
        });
      }
      return createNotificationGroup({
        name: values.name,
        displayName: values.displayName,
        description: values.description || undefined,
        allowSubscriptionToClients: values.allowSubscriptionToClients,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-groups'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return <AppErrorState message={toApiError(detail.error).message} onRetry={() => void detail.refetch()} />;
  }
  if (isEdit && detail.data?.isStatic) {
    return <AppErrorState message={t('notificationGroups.staticCannotEdit')} onRetry={() => router.back()} />;
  }

  const fieldError = (key?: string) => (key && key.startsWith('notificationGroups.') ? t(key) : key);

  return (
    <AppScreen title={isEdit ? t('notificationGroups.editTitle') : t('notificationGroups.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('notificationGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('notificationGroups.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('notificationGroups.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="notification-group-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationGroups.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('notificationGroups.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="notification-group-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationGroups.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationGroups.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="notification-group-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="allowSubscriptionToClients"
          render={({ field }) => (
            <View>
              <Text>{t('notificationGroups.allowSubscriptionToClients')}</Text>
              <Switch value={field.value} onValueChange={field.onChange} accessibilityRole="switch" />
            </View>
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={isEdit ? t('common.save') : t('common.create')}
          onPress={form.handleSubmit((values) => {
            setSubmitError(null);
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="notification-group-submit"
        />
      </VStack>
    </AppScreen>
  );
}
