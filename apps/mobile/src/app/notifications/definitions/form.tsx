import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
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
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa định nghĩa thông báo: tạo nhập name (+groupName); sửa chỉ
 * đổi các field còn lại. Enum nhập dạng số theo hint (web dùng Select);
 * providers nhập mỗi dòng một giá trị, gửi đi dạng mảng. Định nghĩa tĩnh
 * không vào được form này (detail đã ẩn nút Sửa).
 */
export default function NotificationDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['notification-definitions']);
  const { name } = useRouteParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useDetailQuery('notification-definitions', name, getNotificationDefinition);

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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('notificationDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = createFieldError(t, 'notificationDefinitions');

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
            <AppFormInput
              control={form.control}
              name="name"
              label={t('notificationDefinitions.name')}
              placeholder={t('notificationDefinitions.namePlaceholder')}
              autoCapitalize="none"
              testID="notification-definition-name"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="groupName"
              label={t('notificationDefinitions.groupName')}
              placeholder={t('notificationDefinitions.groupNamePlaceholder')}
              autoCapitalize="none"
              testID="notification-definition-groupName"
              fieldError={fieldError}
            />
          </>
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('notificationDefinitions.displayName')}
          placeholder={t('notificationDefinitions.displayNamePlaceholder')}
          testID="notification-definition-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('notificationDefinitions.description')}
          placeholder={t('notificationDefinitions.descriptionPlaceholder')}
          multiline
          testID="notification-definition-description"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="allowSubscriptionToClients"
          label={t('notificationDefinitions.allowSubscriptionToClients')}
          layout="stack"
        />
        <AppFormInput
          control={form.control}
          name="notificationType"
          label={t('notificationDefinitions.notificationType')}
          placeholder={t('notificationDefinitions.notificationTypeHint')}
          keyboardType="numeric"
          testID="notification-definition-type"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="notificationLifetime"
          label={t('notificationDefinitions.notificationLifetime')}
          placeholder={t('notificationDefinitions.notificationLifetimeHint')}
          keyboardType="numeric"
          testID="notification-definition-lifetime"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="contentType"
          label={t('notificationDefinitions.contentType')}
          placeholder={t('notificationDefinitions.contentTypeHint')}
          keyboardType="numeric"
          testID="notification-definition-contentType"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="providers"
          label={t('notificationDefinitions.providers')}
          placeholder={t('notificationDefinitions.providersPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="notification-definition-providers"
        />
        <AppFormInput
          control={form.control}
          name="template"
          label={t('notificationDefinitions.template')}
          placeholder={t('notificationDefinitions.templatePlaceholder')}
          autoCapitalize="none"
          testID="notification-definition-template"
          fieldError={fieldError}
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
