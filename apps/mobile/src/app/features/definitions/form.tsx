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
import { createFeatureDefinition, getFeatureDefinition, updateFeatureDefinition } from '../../../features/features/feature-definitions-api';
import { featureDefinitionFormDefaults, featureDefinitionFormSchema, type FeatureDefinitionFormValues } from '../../../features/features/feature-definition-form-schema';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa định nghĩa tính năng: tạo nhập name + groupName + valueType;
 * sửa không gửi name/groupName, giữ nguyên concurrencyStamp + extraProperties.
 * valueType nhập dạng text (tên kiểu giá trị, VD FreeTextStringValueType) vì
 * mobile chưa có picker kiểu giá trị; định nghĩa tĩnh không vào được form
 * này (detail đã ẩn nút Sửa).
 */
export default function FeatureDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({ queryKey: ['feature-definitions', name], queryFn: () => getFeatureDefinition(name as string), enabled: isEdit });

  const form = useForm<FeatureDefinitionFormValues>({
    resolver: zodResolver(featureDefinitionFormSchema),
    defaultValues: featureDefinitionFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          groupName: detail.data.groupName,
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          defaultValue: detail.data.defaultValue ?? '',
          valueType: detail.data.valueType ?? '',
          isAvailableToHost: detail.data.isAvailableToHost,
          isVisibleToClients: detail.data.isVisibleToClients,
          parentName: detail.data.parentName ?? '',
          allowedProviders: toMultiline(detail.data.allowedProviders),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: FeatureDefinitionFormValues) => {
      const clean = (v: string) => {
        const trimmed = v.trim();
        return trimmed ? trimmed : undefined;
      };
      const body = {
        displayName: values.displayName,
        description: clean(values.description),
        defaultValue: clean(values.defaultValue),
        valueType: values.valueType,
        isAvailableToHost: values.isAvailableToHost,
        isVisibleToClients: values.isVisibleToClients,
        parentName: clean(values.parentName),
        allowedProviders: parseMultiline(values.allowedProviders),
      };
      if (isEdit && detail.data) {
        return updateFeatureDefinition(name as string, {
          ...body,
          concurrencyStamp: detail.data.concurrencyStamp,
          extraProperties: detail.data.extraProperties,
        });
      }
      if (isEdit) return updateFeatureDefinition(name as string, body);
      return createFeatureDefinition({ name: values.name, groupName: values.groupName, ...body });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feature-definitions'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return <AppErrorState message={toApiError(detail.error).message} onRetry={() => void detail.refetch()} />;
  }
  if (isEdit && detail.data?.isStatic) {
    return <AppErrorState message={t('featureDefinitions.staticCannotEdit')} onRetry={() => router.back()} />;
  }

  const fieldError = (key?: string) => (key && key.startsWith('featureDefinitions.') ? t(key) : key);

  return (
    <AppScreen title={isEdit ? t('featureDefinitions.editTitle') : t('featureDefinitions.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <>
            <Text>
              {t('featureDefinitions.name')}: {detail.data?.name}
            </Text>
            <Text>
              {t('featureDefinitions.groupName')}: {detail.data?.groupName}
            </Text>
          </>
        ) : (
          <>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('featureDefinitions.name')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('featureDefinitions.namePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="feature-definition-name"
                />
              )}
            />
            <Controller
              control={form.control}
              name="groupName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('featureDefinitions.groupName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('featureDefinitions.groupNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="feature-definition-groupName"
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
              label={t('featureDefinitions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureDefinitions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="feature-definition-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('featureDefinitions.description')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureDefinitions.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="feature-definition-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="defaultValue"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('featureDefinitions.defaultValue')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureDefinitions.defaultValuePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="feature-definition-defaultValue"
            />
          )}
        />
        <Controller
          control={form.control}
          name="valueType"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('featureDefinitions.valueType')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureDefinitions.valueTypePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="feature-definition-valueType"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isAvailableToHost"
          render={({ field }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>{t('featureDefinitions.isAvailableToHost')}</Text>
              <Switch value={field.value} onValueChange={field.onChange} accessibilityRole="switch" />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="isVisibleToClients"
          render={({ field }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>{t('featureDefinitions.isVisibleToClients')}</Text>
              <Switch value={field.value} onValueChange={field.onChange} accessibilityRole="switch" />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="parentName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('featureDefinitions.parentName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureDefinitions.parentNamePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="feature-definition-parentName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="allowedProviders"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('featureDefinitions.allowedProviders')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureDefinitions.allowedProvidersPlaceholder')}
              autoCapitalize="none"
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="feature-definition-allowedProviders"
            />
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
          testID="feature-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
