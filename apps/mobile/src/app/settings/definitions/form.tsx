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
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['setting-definitions'] });
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
        message={t('settingDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = (key?: string) =>
    key && key.startsWith('settingDefinitions.') ? t(key) : key;

  return (
    <AppScreen
      title={isEdit ? t('settingDefinitions.editTitle') : t('settingDefinitions.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('settingDefinitions.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('settingDefinitions.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('settingDefinitions.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="setting-definition-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('settingDefinitions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('settingDefinitions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="setting-definition-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('settingDefinitions.description')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('settingDefinitions.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="setting-definition-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="defaultValue"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('settingDefinitions.defaultValue')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('settingDefinitions.defaultValuePlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="setting-definition-defaultValue"
            />
          )}
        />
        <Controller
          control={form.control}
          name="providers"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('settingDefinitions.providers')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('settingDefinitions.providersPlaceholder')}
              multiline
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="setting-definition-providers"
            />
          )}
        />
        {providersQuery.data && providersQuery.data.items.length > 0 ? (
          <Text>
            {t('settingDefinitions.assignableProviders')}:{' '}
            {providersQuery.data.items.map((item) => item.value).join(', ')}
          </Text>
        ) : null}
        <Controller
          control={form.control}
          name="isEncrypted"
          render={({ field }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{t('settingDefinitions.isEncrypted')}</Text>
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
          name="isInherited"
          render={({ field }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{t('settingDefinitions.isInherited')}</Text>
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
          name="isVisibleToClients"
          render={({ field }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{t('settingDefinitions.isVisibleToClients')}</Text>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                accessibilityRole="switch"
              />
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
          testID="setting-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
