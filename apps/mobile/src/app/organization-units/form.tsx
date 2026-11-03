import { useRouteParams } from '../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDetailQuery } from '../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppFormInput } from '../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../components/ui/AppFormSubmit';
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
import { useSubmitError } from '../../lib/use-submit-error';
import { queryStateElement } from '../../lib/query-state';
import { createFieldError } from '../../lib/field-error';
import { useInvalidateAndBack } from '../../lib/mutation-success';

/**
 * Form tạo/sửa đơn vị tổ chức: /organization-units/form (tạo gốc hoặc tạo con
 * với ?parentId=...), /organization-units/form?id=... (sửa: chỉ đổi displayName,
 * đúng OrganizationUnitUpdateDto). Parent hiển thị chỉ đọc, không chọn lại —
 * di chuyển đơn vị (API /move) để vòng sau cùng picker chọn cha.
 */
export default function OrganizationUnitFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['organization-units']);
  const { id, parentId } = useRouteParams<{ id?: string; parentId?: string }>();
  const isEdit = Boolean(id);
  const {
    error: submitError,
    onError: handleSubmitError,
    clearError: clearSubmitError,
  } = useSubmitError();

  const detail = useDetailQuery('organization-units', id, getOrganizationUnit);
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
    onSuccess: invalidateAndBack,
    onError: handleSubmitError,
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;
  const fieldError = createFieldError(t, 'organizationUnits');

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
        <AppFormInput
          control={form.control}
          name="displayName"
          label={t('organizationUnits.displayName')}
          placeholder={t('organizationUnits.displayNamePlaceholder')}
          testID="organization-unit-display-name"
          fieldError={fieldError}
        />
        <AppFormSubmit
          error={submitError}
          title={isEdit ? t('common.save') : t('common.create')}
          onPress={form.handleSubmit((values) => {
            clearSubmitError();
            mutation.mutate(values);
          })}
          loading={mutation.isPending}
          testID="organization-unit-submit"
        />
      </VStack>
    </AppScreen>
  );
}
