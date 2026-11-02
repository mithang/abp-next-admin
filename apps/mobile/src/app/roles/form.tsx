import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppSwitchField } from '../../components/ui/AppSwitchField';
import { AppInput } from '../../components/ui/AppInput';
import { AppFormSubmit } from '../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { createRole, getRole, updateRole } from '../../features/identity/roles-api';
import {
  roleFormDefaults,
  roleFormSchema,
  type RoleFormValues,
} from '../../features/identity/role-form-schema';
import { toApiError } from '../../lib/errors';
import { queryStateElement } from '../../lib/query-state';
import { createFieldError } from '../../lib/field-error';

/**
 * Form tạo/sửa vai trò: route /roles/form (tạo) hoặc /roles/form?id=<id> (sửa).
 * Không dùng route /roles/[id]/edit vì xung đột file [id].tsx trong Expo Router.
 * RHF + Zod theo prompt mục 9: lỗi theo field, ngăn double submit, giữ dữ liệu khi lỗi.
 */
export default function RoleFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRole(id as string),
    enabled: isEdit,
  });

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: roleFormDefaults,
    values: detail.data
      ? { name: detail.data.name, isDefault: detail.data.isDefault, isPublic: detail.data.isPublic }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: RoleFormValues) => {
      if (isEdit) {
        return updateRole(id as string, {
          ...values,
          concurrencyStamp: detail.data?.concurrencyStamp,
        });
      }
      return createRole(values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.back();
    },
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'roles');

  return (
    <AppScreen scrollable title={isEdit ? t('roles.editTitle') : t('roles.createTitle')}>
      <VStack space="md">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('roles.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('roles.namePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="role-name"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <AppSwitchField
              label={t('roles.isDefault')}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <AppSwitchField
              label={t('roles.isPublic')}
              value={field.value}
              onValueChange={field.onChange}
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
          testID="role-submit"
        />
      </VStack>
    </AppScreen>
  );
}
