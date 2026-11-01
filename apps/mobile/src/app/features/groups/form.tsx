import { useState } from 'react';
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
import { createFeatureGroup, getFeatureGroup, updateFeatureGroup } from '../../../features/features/feature-groups-api';
import { featureGroupFormDefaults, featureGroupFormSchema, type FeatureGroupFormValues } from '../../../features/features/feature-group-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa nhóm tính năng: tạo nhập name + displayName; sửa chỉ đổi
 * displayName và giữ nguyên concurrencyStamp + extraProperties hiện có.
 * Nhóm tĩnh không vào được form này (detail đã ẩn nút Sửa).
 */
export default function FeatureGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({ queryKey: ['feature-groups', name], queryFn: () => getFeatureGroup(name as string), enabled: isEdit });

  const form = useForm<FeatureGroupFormValues>({
    resolver: zodResolver(featureGroupFormSchema),
    defaultValues: featureGroupFormDefaults,
    values: detail.data ? { name: detail.data.name, displayName: detail.data.displayName ?? '' } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: FeatureGroupFormValues) => {
      if (isEdit && detail.data) {
        return updateFeatureGroup(name as string, {
          displayName: values.displayName,
          concurrencyStamp: detail.data.concurrencyStamp,
          extraProperties: detail.data.extraProperties,
        });
      }
      if (isEdit) return updateFeatureGroup(name as string, { displayName: values.displayName });
      return createFeatureGroup({ name: values.name, displayName: values.displayName });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feature-groups'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return <AppErrorState message={toApiError(detail.error).message} onRetry={() => void detail.refetch()} />;
  }
  if (isEdit && detail.data?.isStatic) {
    return <AppErrorState message={t('featureGroups.staticCannotEdit')} onRetry={() => router.back()} />;
  }

  const fieldError = (key?: string) => (key && key.startsWith('featureGroups.') ? t(key) : key);

  return (
    <AppScreen title={isEdit ? t('featureGroups.editTitle') : t('featureGroups.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('featureGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('featureGroups.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('featureGroups.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="feature-group-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('featureGroups.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('featureGroups.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="feature-group-displayName"
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
          testID="feature-group-submit"
        />
      </VStack>
    </AppScreen>
  );
}
