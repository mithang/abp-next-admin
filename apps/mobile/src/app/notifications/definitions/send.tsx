import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { sendNotification } from '../../../features/notifications/notifications-api';
import {
  notificationSendFormDefaults,
  notificationSendFormSchema,
  type NotificationSendFormValues,
} from '../../../features/notifications/notification-send-form-schema';
import { parseEnumNumber } from '../../../features/notifications/notification-definition-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form gửi thông báo (web NotificationSendModal): name khóa theo định nghĩa
 * đã chọn; gửi POST /api/notifications/send với data { title, message,
 * description } như web; severity/culture tùy chọn. Không có chọn người nhận
 * (web modal cũng không chọn toUsers — gửi theo định nghĩa/subscription).
 */
export default function NotificationSendScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['notification-send-records']);
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
        data: {
          title: values.title,
          message: values.message,
          description: values.description || undefined,
        },
        severity: parseEnumNumber(values.severity),
        culture: values.culture || undefined,
      }),
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const fieldError = createFieldError(t, 'notificationSend');

  return (
    <AppScreen scrollable title={t('notificationSend.title')}>
      <VStack space="md">
        <Text>
          {t('notificationSend.name')}: {name}
        </Text>
        <AppFormInput
          control={form.control}
          name="title"
          label={t('notificationSend.notifTitle')}
          placeholder={t('notificationSend.titlePlaceholder')}
          testID="notification-send-title"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="message"
          label={t('notificationSend.message')}
          placeholder={t('notificationSend.messagePlaceholder')}
          multiline
          testID="notification-send-message"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('notificationSend.description')}
          placeholder={t('notificationSend.descriptionPlaceholder')}
          multiline
          testID="notification-send-description"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="culture"
          label={t('notificationSend.culture')}
          placeholder={t('notificationSend.culturePlaceholder')}
          autoCapitalize="none"
          testID="notification-send-culture"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="severity"
          label={t('notificationSend.severity')}
          placeholder={t('notificationSend.severityHint')}
          keyboardType="numeric"
          testID="notification-send-severity"
          fieldError={fieldError}
        />
        <AppFormSubmit
          error={submitError}
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
