import { useState } from 'react';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { createScope, getScope, updateScope } from '../../../features/openiddict/scopes-api';
import {
  scopeFormDefaults,
  scopeFormSchema,
  type ScopeFormValues,
} from '../../../features/openiddict/scope-form-schema';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa phạm vi: route /openiddict/scopes/form (tạo) hoặc
 * /openiddict/scopes/form?id=<id> (sửa), theo pattern /roles/form.
 * Resources nhập nhiều dòng, chuyển thành mảng lúc submit.
 */
export default function ScopeFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['openiddict-scopes']);
  const { id } = useRouteParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useDetailQuery('openiddict-scopes', id, getScope);

  const form = useForm<ScopeFormValues>({
    resolver: zodResolver(scopeFormSchema),
    defaultValues: scopeFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          displayName: detail.data.displayName ?? '',
          description: detail.data.description ?? '',
          resources: toMultiline(detail.data.resources),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: ScopeFormValues) => {
      const body = {
        name: values.name,
        displayName: values.displayName || undefined,
        description: values.description || undefined,
        resources: parseMultiline(values.resources),
      };
      // Khi sửa: giữ nguyên các field web có mà form mobile chưa sửa được
      // (displayNames/descriptions đa ngôn ngữ, properties) để lần sửa không
      // vô tình xóa chúng.
      if (isEdit && detail.data)
        return updateScope(id as string, {
          ...body,
          displayNames: detail.data.displayNames,
          descriptions: detail.data.descriptions,
          properties: detail.data.properties,
        });
      if (isEdit) return updateScope(id as string, body);
      return createScope(body);
    },
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'openiddictScopes');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('openiddictScopes.editTitle') : t('openiddictScopes.createTitle')}
    >
      <VStack space="md">
        <AppFormInput
          control={form.control}
          name="name"
          label={t('openiddictScopes.name')}
          placeholder={t('openiddictScopes.namePlaceholder')}
          autoCapitalize="none"
          testID="scope-name"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('openiddictScopes.displayName')}
          placeholder={t('openiddictScopes.displayNamePlaceholder')}
          testID="scope-displayName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="description"
          label={t('openiddictScopes.description')}
          placeholder={t('openiddictScopes.descriptionPlaceholder')}
          multiline
          testID="scope-description"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="resources"
          label={t('openiddictScopes.resources')}
          placeholder={t('openiddictScopes.resourcesPlaceholder')}
          autoCapitalize="none"
          multiline
          testID="scope-resources"
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
          testID="scope-submit"
        />
      </VStack>
    </AppScreen>
  );
}
