import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createFeatureGroup,
  getFeatureGroup,
  updateFeatureGroup,
} from '../../../features/features/feature-groups-api';
import {
  featureGroupFormDefaults,
  featureGroupFormSchema,
  type FeatureGroupFormValues,
} from '../../../features/features/feature-group-form-schema';
import { toApiError } from '../../../lib/errors';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa nhóm tính năng: tạo nhập name + displayName; sửa chỉ đổi
 * displayName và giữ nguyên concurrencyStamp + extraProperties hiện có.
 * Nhóm tĩnh không vào được form này (detail đã ẩn nút Sửa).
 */
export default function FeatureGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['feature-groups']);
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['feature-groups', name],
    queryFn: () => getFeatureGroup(name as string),
    enabled: isEdit,
  });

  const form = useForm<FeatureGroupFormValues>({
    resolver: zodResolver(featureGroupFormSchema),
    defaultValues: featureGroupFormDefaults,
    values: detail.data
      ? { name: detail.data.name, displayName: detail.data.displayName ?? '' }
      : undefined,
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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  if (isEdit && detail.data?.isStatic) {
    return (
      <AppErrorState message={t('featureGroups.staticCannotEdit')} onRetry={() => router.back()} />
    );
  }

  const fieldError = createFieldError(t, 'featureGroups');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('featureGroups.editTitle') : t('featureGroups.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('featureGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('featureGroups.name')}
            placeholder={t('featureGroups.namePlaceholder')}
            autoCapitalize="none"
            testID="feature-group-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('featureGroups.displayName')}
          placeholder={t('featureGroups.displayNamePlaceholder')}
          testID="feature-group-displayName"
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
          testID="feature-group-submit"
        />
      </VStack>
    </AppScreen>
  );
}
