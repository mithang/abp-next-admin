import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { createScope, getScope, updateScope } from '../../../features/openiddict/scopes-api';
import {
  scopeFormDefaults,
  scopeFormSchema,
  type ScopeFormValues,
} from '../../../features/openiddict/scope-form-schema';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa phạm vi: route /openiddict/scopes/form (tạo) hoặc
 * /openiddict/scopes/form?id=<id> (sửa), theo pattern /roles/form.
 * Resources nhập nhiều dòng, chuyển thành mảng lúc submit.
 */
export default function ScopeFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['openiddict-scopes', id],
    queryFn: () => getScope(id as string),
    enabled: isEdit,
  });

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['openiddict-scopes'] });
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

  const fieldError = (key?: string) => (key && key.startsWith('openiddictScopes.') ? t(key) : key);

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('openiddictScopes.editTitle') : t('openiddictScopes.createTitle')}
    >
      <VStack space="md">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('openiddictScopes.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('openiddictScopes.namePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="scope-name"
            />
          )}
        />
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('openiddictScopes.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('openiddictScopes.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="scope-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('openiddictScopes.description')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('openiddictScopes.descriptionPlaceholder')}
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="scope-description"
            />
          )}
        />
        <Controller
          control={form.control}
          name="resources"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('openiddictScopes.resources')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('openiddictScopes.resourcesPlaceholder')}
              autoCapitalize="none"
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="scope-resources"
            />
          )}
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
