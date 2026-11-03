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
  createFeatureDefinition,
  getFeatureDefinition,
  updateFeatureDefinition,
} from '../../../features/features/feature-definitions-api';
import {
  featureDefinitionFormDefaults,
  featureDefinitionFormSchema,
  type FeatureDefinitionFormValues,
} from '../../../features/features/feature-definition-form-schema';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

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
  const invalidateAndBack = useInvalidateAndBack(['feature-definitions']);
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['feature-definitions', name],
    queryFn: () => getFeatureDefinition(name as string),
    enabled: isEdit,
  });

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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState
        message={t('featureDefinitions.staticCannotEdit')}
        onRetry={() => router.back()}
      />
    );
  }

  const fieldError = createFieldError(t, 'featureDefinitions');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('featureDefinitions.editTitle') : t('featureDefinitions.createTitle')}
    >
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
            <AppFormInput
              control={form.control}
              name="name"
              label={t('featureDefinitions.name')}
              placeholder={t('featureDefinitions.namePlaceholder')}
              autoCapitalize="none"
              testID="feature-definition-name"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="groupName"
              label={t('featureDefinitions.groupName')}
              placeholder={t('featureDefinitions.groupNamePlaceholder')}
              autoCapitalize="none"
              testID="feature-definition-groupName"
              fieldError={fieldError}
            />
          </>
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('featureDefinitions.displayName')}
          placeholder={t('featureDefinitions.displayNamePlaceholder')}
          testID="feature-definition-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('featureDefinitions.description')}
          placeholder={t('featureDefinitions.descriptionPlaceholder')}
          multiline
          testID="feature-definition-description"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="defaultValue"
          label={t('featureDefinitions.defaultValue')}
          placeholder={t('featureDefinitions.defaultValuePlaceholder')}
          autoCapitalize="none"
          testID="feature-definition-defaultValue"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="valueType"
          label={t('featureDefinitions.valueType')}
          placeholder={t('featureDefinitions.valueTypePlaceholder')}
          autoCapitalize="none"
          testID="feature-definition-valueType"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="isAvailableToHost"
          label={t('featureDefinitions.isAvailableToHost')}
        />
        <AppFormSwitch
          control={form.control}
          name="isVisibleToClients"
          label={t('featureDefinitions.isVisibleToClients')}
        />
        <AppFormInput
          control={form.control}
          name="parentName"
          label={t('featureDefinitions.parentName')}
          placeholder={t('featureDefinitions.parentNamePlaceholder')}
          autoCapitalize="none"
          testID="feature-definition-parentName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="allowedProviders"
          label={t('featureDefinitions.allowedProviders')}
          placeholder={t('featureDefinitions.allowedProvidersPlaceholder')}
          autoCapitalize="none"
          multiline
          testID="feature-definition-allowedProviders"
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
          testID="feature-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
