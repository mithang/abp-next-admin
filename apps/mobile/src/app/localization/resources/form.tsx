import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSwitchField } from '../../../components/ui/AppSwitchField';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createResource,
  getResource,
  updateResource,
} from '../../../features/localization/localization-api';
import {
  resourceFormDefaults,
  resourceFormSchema,
  type ResourceFormValues,
} from '../../../features/localization/form-schemas';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa tài nguyên theo modal web: enable + name + displayName +
 * description. Modal web không có ô defaultCultureName nên khi sửa, giá trị
 * đã tải được giữ nguyên trong body update (không tự đặt lại).
 */
export default function ResourceFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['resources', name],
    queryFn: () => getResource(name as string),
    enabled: isEdit,
  });

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: resourceFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          enable: detail.data.enable,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: ResourceFormValues) => {
      const clean = (v: string) => {
        const trimmed = v.trim();
        return trimmed ? trimmed : undefined;
      };
      if (isEdit && detail.data) {
        return updateResource(name as string, {
          displayName: values.displayName,
          description: clean(values.description),
          defaultCultureName: detail.data.defaultCultureName,
          enable: values.enable,
        });
      }
      if (isEdit) {
        return updateResource(name as string, {
          displayName: values.displayName,
          description: clean(values.description),
          enable: values.enable,
        });
      }
      return createResource({
        name: values.name,
        displayName: values.displayName,
        description: clean(values.description),
        enable: values.enable,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['resources'] });
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

  const fieldError = (key?: string) => (key && key.startsWith('resources.') ? t(key) : key);

  return (
    <AppScreen scrollable title={isEdit ? t('resources.editTitle') : t('resources.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('resources.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('resources.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('resources.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="resource-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('resources.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('resources.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="resource-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('resources.description')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('resources.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="resource-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="enable"
          render={({ field }) => (
            <AppSwitchField
              label={t('resources.enable')}
              value={field.value}
              onValueChange={field.onChange}
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
          testID="resource-submit"
        />
      </VStack>
    </AppScreen>
  );
}
