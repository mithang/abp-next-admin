import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSwitchField } from '../../../components/ui/AppSwitchField';
import { AppInput } from '../../../components/ui/AppInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createPermissionDefinition,
  getPermissionDefinition,
  updatePermissionDefinition,
} from '../../../features/permissions/permission-definitions-api';
import {
  permissionDefinitionFormDefaults,
  permissionDefinitionFormSchema,
  type PermissionDefinitionFormValues,
} from '../../../features/permissions/permission-definition-form-schema';
import { parseMultiline, toMultiline } from '../../../features/openiddict/multiline';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa định nghĩa quyền: tạo nhập name + groupName; sửa chỉ đổi
 * displayName/isEnabled/parentName/providers/stateCheckers (update DTO không
 * nhận name/groupName) và giữ nguyên extraProperties hiện có.
 */
export default function PermissionDefinitionFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const isEdit = Boolean(name);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['permission-definitions', name],
    queryFn: () => getPermissionDefinition(name as string),
    enabled: isEdit,
  });

  const form = useForm<PermissionDefinitionFormValues>({
    resolver: zodResolver(permissionDefinitionFormSchema),
    defaultValues: permissionDefinitionFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          groupName: detail.data.groupName,
          displayName: detail.data.displayName ?? '',
          isEnabled: detail.data.isEnabled,
          parentName: detail.data.parentName ?? '',
          providers: toMultiline(detail.data.providers),
          stateCheckers: detail.data.stateCheckers ?? '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: PermissionDefinitionFormValues) => {
      const clean = (v: string) => {
        const trimmed = v.trim();
        return trimmed ? trimmed : undefined;
      };
      const body = {
        displayName: values.displayName,
        isEnabled: values.isEnabled,
        parentName: clean(values.parentName),
        providers: parseMultiline(values.providers),
        stateCheckers: values.stateCheckers,
      };
      if (isEdit && detail.data) {
        return updatePermissionDefinition(name as string, {
          ...body,
          extraProperties: detail.data.extraProperties,
        });
      }
      if (isEdit) return updatePermissionDefinition(name as string, body);
      return createPermissionDefinition({
        name: values.name,
        groupName: values.groupName,
        ...body,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['permission-definitions'] });
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

  const fieldError = (key?: string) =>
    key && key.startsWith('permissionDefinitions.') ? t(key) : key;

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('permissionDefinitions.editTitle') : t('permissionDefinitions.createTitle')}
    >
      <VStack space="md">
        {isEdit ? (
          <>
            <Text>
              {t('permissionDefinitions.name')}: {detail.data?.name}
            </Text>
            <Text>
              {t('permissionDefinitions.groupName')}: {detail.data?.groupName}
            </Text>
          </>
        ) : (
          <>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('permissionDefinitions.name')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('permissionDefinitions.namePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="permission-definition-name"
                />
              )}
            />
            <Controller
              control={form.control}
              name="groupName"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('permissionDefinitions.groupName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('permissionDefinitions.groupNamePlaceholder')}
                  autoCapitalize="none"
                  error={fieldError(fieldState.error?.message)}
                  testID="permission-definition-groupName"
                />
              )}
            />
          </>
        )}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('permissionDefinitions.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('permissionDefinitions.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="permission-definition-displayName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <AppSwitchField
              label={t('permissionDefinitions.isEnabled')}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="parentName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('permissionDefinitions.parentName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('permissionDefinitions.parentNamePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="permission-definition-parentName"
            />
          )}
        />
        <Controller
          control={form.control}
          name="providers"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('permissionDefinitions.providers')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('permissionDefinitions.providersPlaceholder')}
              autoCapitalize="none"
              multiline
              error={fieldError(fieldState.error?.message)}
              testID="permission-definition-providers"
            />
          )}
        />
        <Controller
          control={form.control}
          name="stateCheckers"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('permissionDefinitions.stateCheckers')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('permissionDefinitions.stateCheckersPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
              testID="permission-definition-stateCheckers"
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
          testID="permission-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
