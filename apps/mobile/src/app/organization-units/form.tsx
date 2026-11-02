import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnitsAll,
  updateOrganizationUnit,
} from '../../features/identity/organization-units-api';
import { findOrganizationUnitName } from '../../features/identity/organization-units';
import {
  organizationUnitFormDefaults,
  organizationUnitFormSchema,
  toOrganizationUnitCreateInput,
  toOrganizationUnitUpdateInput,
  type OrganizationUnitFormValues,
} from '../../features/identity/organization-unit-form-schema';
import { toApiError } from '../../lib/errors';

/**
 * Form tạo/sửa đơn vị tổ chức: /organization-units/form (tạo gốc hoặc tạo con
 * với ?parentId=...), /organization-units/form?id=... (sửa: chỉ đổi displayName,
 * đúng OrganizationUnitUpdateDto). Parent hiển thị chỉ đọc, không chọn lại —
 * di chuyển đơn vị (API /move) để vòng sau cùng picker chọn cha.
 */
export default function OrganizationUnitFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, parentId } = useLocalSearchParams<{ id?: string; parentId?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['organization-units', id],
    queryFn: () => getOrganizationUnit(id as string),
    enabled: isEdit,
  });
  const all = useQuery({
    queryKey: ['organization-units', 'all'],
    queryFn: getOrganizationUnitsAll,
    enabled: !isEdit && Boolean(parentId),
  });
  const parentName = all.data ? findOrganizationUnitName(all.data.items, parentId) : undefined;

  const form = useForm<OrganizationUnitFormValues>({
    resolver: zodResolver(organizationUnitFormSchema),
    defaultValues: organizationUnitFormDefaults,
    values: detail.data
      ? { displayName: detail.data.displayName, parentId: detail.data.parentId }
      : parentId
        ? { displayName: '', parentId }
        : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: OrganizationUnitFormValues) => {
      if (isEdit)
        return updateOrganizationUnit(id as string, toOrganizationUnitUpdateInput(values));
      return createOrganizationUnit(toOrganizationUnitCreateInput(values));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['organization-units'] });
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
  const fieldError = (key?: string) => (key && key.startsWith('organizationUnits.') ? t(key) : key);

  return (
    <AppScreen
      scrollable
      title={isEdit ? t('organizationUnits.editTitle') : t('organizationUnits.createTitle')}
    >
      <VStack space="md">
        {!isEdit ? (
          <Text>
            {t('organizationUnits.parent')}: {parentName ?? parentId ?? t('organizationUnits.root')}
          </Text>
        ) : null}
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('organizationUnits.displayName')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('organizationUnits.displayNamePlaceholder')}
              error={fieldError(fieldState.error?.message)}
              testID="organization-unit-display-name"
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
          testID="organization-unit-submit"
        />
      </VStack>
    </AppScreen>
  );
}
