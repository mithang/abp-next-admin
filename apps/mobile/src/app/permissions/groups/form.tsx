import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createPermissionGroup,
  getPermissionGroup,
  updatePermissionGroup,
} from '../../../features/permissions/permission-groups-api';
import {
  permissionGroupFormDefaults,
  permissionGroupFormSchema,
  type PermissionGroupFormValues,
} from '../../../features/permissions/permission-group-form-schema';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa nhóm quyền: tạo nhập name + displayName; sửa chỉ đổi
 * displayName (update DTO không nhận name) và giữ nguyên extraProperties
 * của bản ghi hiện có để lần sửa không xóa chúng (bài học vòng 5).
 */
export default function PermissionGroupFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['permission-groups']);
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['permission-groups', name],
    queryFn: () => getPermissionGroup(name as string),
    enabled: isEdit,
  });

  const form = useForm<PermissionGroupFormValues>({
    resolver: zodResolver(permissionGroupFormSchema),
    defaultValues: permissionGroupFormDefaults,
    values: detail.data
      ? { name: detail.data.name, displayName: detail.data.displayName ?? '' }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: PermissionGroupFormValues) => {
      if (isEdit && detail.data) {
        return updatePermissionGroup(name as string, {
          displayName: values.displayName,
          extraProperties: detail.data.extraProperties,
        });
      }
      if (isEdit) return updatePermissionGroup(name as string, { displayName: values.displayName });
      return createPermissionGroup({ name: values.name, displayName: values.displayName });
    },
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'permissionGroups');

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('permissionGroups.editTitle') : t('permissionGroups.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('permissionGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <AppFormInput
            control={form.control}
            name="name"
            label={t('permissionGroups.name')}
            placeholder={t('permissionGroups.namePlaceholder')}
            autoCapitalize="none"
            testID="permission-group-name"
            fieldError={fieldError}
          />
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('permissionGroups.displayName')}
          placeholder={t('permissionGroups.displayNamePlaceholder')}
          testID="permission-group-displayName"
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
          testID="permission-group-submit"
        />
      </VStack>
    </AppScreen>
  );
}
