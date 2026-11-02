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

/**
 * Form tạo/sửa nhóm quyền: tạo nhập name + displayName; sửa chỉ đổi
 * displayName (update DTO không nhận name) và giữ nguyên extraProperties
 * của bản ghi hiện có để lần sửa không xóa chúng (bài học vòng 5).
 */
export default function PermissionGroupFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['permission-groups'] });
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

  const fieldError = (key?: string) => (key && key.startsWith('permissionGroups.') ? t(key) : key);

  return (
    <AppScreen title={isEdit ? t('permissionGroups.editTitle') : t('permissionGroups.createTitle')}>
      <VStack space="md">
        {isEdit ? (
          <Text>
            {t('permissionGroups.name')}: {detail.data?.name}
          </Text>
        ) : (
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('permissionGroups.name')}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('permissionGroups.namePlaceholder')}
                autoCapitalize="none"
                error={fieldError(fieldState.error?.message)}
                testID="permission-group-name"
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('permissionGroups.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('permissionGroups.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="permission-group-displayName"
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
          testID="permission-group-submit"
        />
      </VStack>
    </AppScreen>
  );
}
