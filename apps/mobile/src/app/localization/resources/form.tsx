import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormSwitch } from '../../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
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
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa tài nguyên theo modal web: enable + name + displayName +
 * description. Modal web không có ô defaultCultureName nên khi sửa, giá trị
 * đã tải được giữ nguyên trong body update (không tự đặt lại).
 */
export default function ResourceFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['resources']);
  const { name } = useRouteParams<{ name?: string }>();
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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'resources');

  return (
    <AppScreen scrollable title={isEdit ? t('resources.editTitle') : t('resources.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('resources.name')}: {detail.data?.name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('resources.name')}
            placeholder={t('resources.namePlaceholder')}
            autoCapitalize="none"
            testID="resource-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('resources.displayName')}
          placeholder={t('resources.displayNamePlaceholder')}
          testID="resource-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('resources.description')}
          placeholder={t('resources.descriptionPlaceholder')}
          multiline
          testID="resource-description"
          fieldError={fieldError}
        />
        <AppFormSwitch control={form.control} name="enable" label={t('resources.enable')} />
        <AppFormSubmit
          error={submitError}
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
