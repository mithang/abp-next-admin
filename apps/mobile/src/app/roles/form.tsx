import { useState } from 'react';
import { useRouteParams } from '../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppFormSwitch } from '../../components/ui/AppFormSwitch';
import { AppFormInput } from '../../components/ui/AppFormInput';
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
import { useInvalidateAndBack } from '../../lib/mutation-success';

/**
 * Form tạo/sửa vai trò: route /roles/form (tạo) hoặc /roles/form?id=<id> (sửa).
 * Không dùng route /roles/[id]/edit vì xung đột file [id].tsx trong Expo Router.
 * RHF + Zod theo prompt mục 9: lỗi theo field, ngăn double submit, giữ dữ liệu khi lỗi.
 */
export default function RoleFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['roles']);
  const { id } = useRouteParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useDetailQuery('roles', id, getRole);

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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'roles');

  return (
    <AppScreen scrollable title={isEdit ? t('roles.editTitle') : t('roles.createTitle')}>
      <VStack space="md">
        <AppFormInput
          control={form.control}
          name="name"
          label={t('roles.name')}
          placeholder={t('roles.namePlaceholder')}
          autoCapitalize="none"
          testID="role-name"
          fieldError={fieldError}
        />
        <AppFormSwitch control={form.control} name="isDefault" label={t('roles.isDefault')} />
        <AppFormSwitch control={form.control} name="isPublic" label={t('roles.isPublic')} />
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
