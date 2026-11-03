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
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa định nghĩa quyền: tạo nhập name + groupName; sửa chỉ đổi
 * displayName/isEnabled/parentName/providers/stateCheckers (update DTO không
 * nhận name/groupName) và giữ nguyên extraProperties hiện có.
 */
export default function PermissionDefinitionFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['permission-definitions']);
  const { name } = useRouteParams<{ name?: string }>();
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
    onSuccess: invalidateAndBack,
    onError: (error: unknown) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'permissionDefinitions');

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
            <AppFormInput
              control={form.control}
              name="name"
              label={t('permissionDefinitions.name')}
              placeholder={t('permissionDefinitions.namePlaceholder')}
              autoCapitalize="none"
              testID="permission-definition-name"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="groupName"
              label={t('permissionDefinitions.groupName')}
              placeholder={t('permissionDefinitions.groupNamePlaceholder')}
              autoCapitalize="none"
              testID="permission-definition-groupName"
              fieldError={fieldError}
            />
          </>
        )}
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('permissionDefinitions.displayName')}
          placeholder={t('permissionDefinitions.displayNamePlaceholder')}
          testID="permission-definition-displayName"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="isEnabled"
          label={t('permissionDefinitions.isEnabled')}
        />
        <AppFormInput
          control={form.control}
          name="parentName"
          label={t('permissionDefinitions.parentName')}
          placeholder={t('permissionDefinitions.parentNamePlaceholder')}
          autoCapitalize="none"
          testID="permission-definition-parentName"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="providers"
          label={t('permissionDefinitions.providers')}
          placeholder={t('permissionDefinitions.providersPlaceholder')}
          autoCapitalize="none"
          multiline
          testID="permission-definition-providers"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="stateCheckers"
          label={t('permissionDefinitions.stateCheckers')}
          placeholder={t('permissionDefinitions.stateCheckersPlaceholder')}
          autoCapitalize="none"
          testID="permission-definition-stateCheckers"
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
          testID="permission-definition-submit"
        />
      </VStack>
    </AppScreen>
  );
}
