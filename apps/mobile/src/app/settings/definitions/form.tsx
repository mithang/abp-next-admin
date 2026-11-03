import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  createSettingDefinition,
  getAssignableProviders,
  getSettingDefinition,
  updateSettingDefinition,
} from '../../../features/settings/settings-definitions-api';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import {
  settingDefinitionFormDefaults,
  settingDefinitionFormSchema,
  type SettingDefinitionFormValues,
} from '../../../features/settings/setting-definition-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa định nghĩa cài đặt: tạo nhập name + displayName; sửa không
 * gửi name/isStatic và giữ nguyên concurrencyStamp + extraProperties của
 * bản ghi hiện có. Providers nhập nhiều dòng → mảng; danh sách assignable
 * providers từ API hiển thị dạng gợi ý (web dùng Select từ cùng danh sách).
 * Định nghĩa tĩnh không vào được form này (detail đã ẩn nút Sửa).
 */
export default function SettingDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['setting-definitions']);
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['setting-definitions', name],
    queryFn: () => getSettingDefinition(name as string),
    enabled: isEdit,
  });
  const providersQuery = useQuery({
    queryKey: ['setting-assignable-providers'],
    queryFn: getAssignableProviders,
  });

  const form = useForm<SettingDefinitionFormValues>({
    resolver: zodResolver(settingDefinitionFormSchema),
    defaultValues: settingDefinitionFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          defaultValue: detail.data.defaultValue ?? '',
          isEncrypted: detail.data.isEncrypted,
          isInherited: detail.data.isInherited,
          isVisibleToClients: detail.data.isVisibleToClients,
          providers: toMultiline(detail.data.providers),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: SettingDefinitionFormValues) => {
      const clean = (v: string) => {
        const trimmed = v.trim();
        return trimmed ? trimmed : undefined;
      };
      const body = {
        displayName: values.displayName,
        description: clean(values.description),
        defaultValue: clean(values.defaultValue),
        isEncrypted: values.isEncrypted,
        isInherited: values.isInherited,
        isVisibleToClients: values.isVisibleToClients,
        providers: parseMultiline(values.providers),
      };
      if (isEdit && detail.data) {
        return updateSettingDefinition(name as string, {
          ...body,
          concurrencyStamp: detail.data.concurrencyStamp,
          extraProperties: detail.data.extraProperties,
        });
      }
      if (isEdit) return updateSettingDefinition(name as string, body);
      return createSettingDefinition({ name: values.name, ...body });
    },
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('settingDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = createFieldError(t, 'settingDefinitions');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('settingDefinitions.editTitle') : t('settingDefinitions.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('settingDefinitions.name')}: {detail.data?.name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('settingDefinitions.name')}
            placeholder={t('settingDefinitions.namePlaceholder')}
            autoCapitalize="none"
            testID="setting-definition-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('settingDefinitions.displayName')}
          placeholder={t('settingDefinitions.displayNamePlaceholder')}
          testID="setting-definition-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('settingDefinitions.description')}
          placeholder={t('settingDefinitions.descriptionPlaceholder')}
          multiline
          testID="setting-definition-description"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="defaultValue"
          label={t('settingDefinitions.defaultValue')}
          placeholder={t('settingDefinitions.defaultValuePlaceholder')}
          multiline
          testID="setting-definition-defaultValue"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="providers"
          label={t('settingDefinitions.providers')}
          placeholder={t('settingDefinitions.providersPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="setting-definition-providers"
          fieldError={fieldError}
        />
        {providersQuery.data && providersQuery.data.items.length > 0 ? (
          <Text>
            {t('settingDefinitions.assignableProviders')}:{' '}
            {providersQuery.data.items.map((item) => item.value).join(', ')}
          </Text>
        ) : null}
        <AppFormSwitch
          control={form.control}
          name="isEncrypted"
          label={t('settingDefinitions.isEncrypted')}
        />
        <AppFormSwitch
          control={form.control}
          name="isInherited"
          label={t('settingDefinitions.isInherited')}
        />
        <AppFormSwitch
          control={form.control}
          name="isVisibleToClients"
          label={t('settingDefinitions.isVisibleToClients')}
        />
        <AppFormSubmit
          error={submitError}
          title={isEdit ? t('common.save') : t('common.create')}
          onPress={form.handleSubmit((values) => {
            setSubmitError(null);
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="setting-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
