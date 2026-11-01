import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { sendNotification } from '../../../features/notifications/notifications-api';
import { notificationSendFormDefaults, notificationSendFormSchema, type NotificationSendFormValues } from '../../../features/notifications/notification-send-form-schema';
import { parseEnumNumber } from '../../../features/notifications/notification-definition-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form gửi thông báo (web NotificationSendModal): name khóa theo định nghĩa
 * đã chọn; gửi POST /api/notifications/send với data { title, message,
 * description } như web; severity/culture tùy chọn. Không có chọn người nhận
 * (web modal cũng không chọn toUsers — gửi theo định nghĩa/subscription).
 */
export default function NotificationSendScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<NotificationSendFormValues>({
    resolver: zodResolver(notificationSendFormSchema),
    defaultValues: notificationSendFormDefaults,
  });

  const mutation = useMutation({
    mutationFn: async (values: NotificationSendFormValues) =>
      sendNotification({
        name: name as string,
        data: { title: values.title, message: values.message, description: values.description || undefined },
        severity: parseEnumNumber(values.severity),
        culture: values.culture || undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-send-records'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const fieldError = (key?: string) => (key && key.startsWith('notificationSend.') ? t(key) : key);

  return (
    <AppScreen title={t('notificationSend.title')}>
      <VStack space="md">
        <Text>
          {t('notificationSend.name')}: {name}
        </Text>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationSend.notifTitle')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('notificationSend.titlePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="notification-send-title"
            />
          )}
        />
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationSend.message')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('notificationSend.messagePlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="notification-send-message"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationSend.description')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationSend.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="notification-send-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="culture"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationSend.culture')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationSend.culturePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="notification-send-culture"
            />
          )}
        />
        <Controller
          control={form.control}
          name="severity"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('notificationSend.severity')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('notificationSend.severityHint')}
              keyboardType="numeric"
              error={fieldError(fieldState.error?.message)}
              testID="notification-send-severity"
            />
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('notificationDefinitions.send')}
          onPress={form.handleSubmit((values) => {
            setSubmitError(null);
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="notification-send-submit"
        />
      </VStack>
    </AppScreen>
  );
}
