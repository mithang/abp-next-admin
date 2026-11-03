import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormSwitch } from '../../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createNotificationGroup,
  getNotificationGroup,
  updateNotificationGroup,
} from '../../../features/notifications/notifications-api';
import {
  notificationGroupFormDefaults,
  notificationGroupFormSchema,
  type NotificationGroupFormValues,
} from '../../../features/notifications/notification-group-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa nhóm thông báo: tạo nhập name + displayName; sửa chỉ đổi
 * displayName/description/allowSubscriptionToClients. Nhóm tĩnh không vào
 * được form này (detail đã ẩn nút Sửa).
 */
export default function NotificationGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['notification-groups']);
  const { name } = useRouteParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['notification-groups', name],
    queryFn: () => getNotificationGroup(name as string),
    enabled: isEdit,
  });

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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('notificationGroups.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = createFieldError(t, 'notificationGroups');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('notificationGroups.editTitle') : t('notificationGroups.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('notificationGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('notificationGroups.name')}
            placeholder={t('notificationGroups.namePlaceholder')}
            autoCapitalize="none"
            testID="notification-group-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('notificationGroups.displayName')}
          placeholder={t('notificationGroups.displayNamePlaceholder')}
          testID="notification-group-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('notificationGroups.description')}
          placeholder={t('notificationGroups.descriptionPlaceholder')}
          multiline
          testID="notification-group-description"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="allowSubscriptionToClients"
          label={t('notificationGroups.allowSubscriptionToClients')}
          layout="stack"
        />
        <AppFormSubmit
          error={submitError}
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
