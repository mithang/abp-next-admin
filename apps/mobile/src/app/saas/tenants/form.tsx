import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormSwitch } from '../../../components/ui/AppFormSwitch';
import { AppFormSelect } from '../../../components/ui/AppFormSelect';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import {
  createTenant,
  getEditionsPaged,
  getTenant,
  updateTenant,
} from '../../../features/saas/saas-api';
import {
  parseExtraPropertiesJson,
  tenantFormDefaults,
  tenantFormSchema,
  type TenantFormValues,
} from '../../../features/saas/tenant-form-schema';
import { buildEditionOptions } from '../../../lib/app-select-options';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Form tạo/sửa tenant, đúng DTO C#:
 * - Tạo: name + adminEmailAddress/adminPassword bắt buộc, useSharedDatabase
 *   mặc định bật; tắt DB chung thì defaultConnectionString bắt buộc.
 * - Sửa: ẩn admin fields, gửi kèm concurrencyStamp lấy từ detail.
 * - editionId chọn qua AppSelect từ GET /api/saas/editions (vòng 29,
 *   đóng nốt mục này của P2 AppSelect); để trống = không gán, nhờ
 *   clearable — đúng schema optionalGuid cũ.
 * - enableTime/disableTime nhập text ISO, schema chặn enable > disable.
 * Chuỗi kết nối có tên riêng (ngoài default) quản lý sau khi tạo ở màn
 * connection-strings, đúng API đặt/xóa của backend.
 */
export default function TenantFormScreen() {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(['saas-tenants']);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['saas-tenants', id],
    queryFn: () => getTenant(id as string),
    enabled: isEdit,
  });
  const editionsQuery = useQuery({
    queryKey: ['saas-editions-hint'],
    queryFn: () => getEditionsPaged({ maxResultCount: 100 }),
  });

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema(!isEdit)),
    defaultValues: tenantFormDefaults,
    values: detail.data
      ? {
          name: detail.data.name,
          isActive: detail.data.isActive,
          editionId: detail.data.editionId ?? '',
          enableTime: detail.data.enableTime ?? '',
          disableTime: detail.data.disableTime ?? '',
          adminEmailAddress: '',
          adminPassword: '',
          useSharedDatabase: true,
          defaultConnectionString: '',
          extraPropertiesJson:
            detail.data.extraProperties && Object.keys(detail.data.extraProperties).length > 0
              ? JSON.stringify(detail.data.extraProperties)
              : '',
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: TenantFormValues) => {
      const shared = {
        name: values.name.trim(),
        isActive: values.isActive,
        editionId: values.editionId?.trim() || undefined,
        enableTime: values.enableTime?.trim() || undefined,
        disableTime: values.disableTime?.trim() || undefined,
        extraProperties: parseExtraPropertiesJson(values),
      };
      if (isEdit) {
        return updateTenant(id as string, {
          ...shared,
          concurrencyStamp: detail.data?.concurrencyStamp ?? '',
        });
      }
      return createTenant({
        ...shared,
        adminEmailAddress: (values.adminEmailAddress ?? '').trim(),
        adminPassword: values.adminPassword ?? '',
        useSharedDatabase: values.useSharedDatabase,
        defaultConnectionString: values.defaultConnectionString?.trim() || undefined,
        connectionStrings: [],
      });
    },
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const fieldError = createFieldError(t, 'saasTenants');
  const editionOptions = buildEditionOptions(editionsQuery.data?.items ?? []);

  return (
    <AppScreen scrollable title={t(isEdit ? 'saasTenants.editTitle' : 'saasTenants.createTitle')}>
      <VStack space="sm">
        <AppFormInput
          control={form.control}
          name="name"
          label={t('saasTenants.name')}
          placeholder={t('saasTenants.namePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormSwitch
          control={form.control}
          name="isActive"
          label={t('saasTenants.isActive')}
          layout="stack"
        />
        <AppFormSelect
          control={form.control}
          name="editionId"
          label={t('saasTenants.edition')}
          options={editionOptions}
          placeholder={
            editionsQuery.isPending
              ? t('saasTenants.editionsLoading')
              : t('saasTenants.editionPlaceholder')
          }
          fieldError={fieldError}
          clearable
          testID="tenant-edition"
        />
        <AppFormInput
          control={form.control}
          name="enableTime"
          label={t('saasTenants.enableTime')}
          placeholder={t('saasTenants.dateTimePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={form.control}
          name="disableTime"
          label={t('saasTenants.disableTime')}
          placeholder={t('saasTenants.dateTimePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        {!isEdit ? (
          <>
            <AppFormInput
              control={form.control}
              name="adminEmailAddress"
              label={t('saasTenants.adminEmailAddress')}
              placeholder={t('saasTenants.adminEmailPlaceholder')}
              autoCapitalize="none"
              keyboardType="email-address"
              fieldError={fieldError}
            />
            <AppFormInput
              control={form.control}
              name="adminPassword"
              label={t('saasTenants.adminPassword')}
              placeholder={t('saasTenants.adminPasswordPlaceholder')}
              secureTextEntry
              fieldError={fieldError}
            />
            <AppFormSwitch
              control={form.control}
              name="useSharedDatabase"
              label={t('saasTenants.useSharedDatabase')}
              layout="stack"
            />
            <AppFormInput
              control={form.control}
              name="defaultConnectionString"
              label={t('saasTenants.defaultConnectionString')}
              placeholder={t('saasTenants.defaultConnectionStringPlaceholder')}
              autoCapitalize="none"
              secureTextEntry
              fieldError={fieldError}
            />
          </>
        ) : null}
        <AppFormInput
          control={form.control}
          name="extraPropertiesJson"
          label={t('saasTenants.extraProperties')}
          placeholder={t('saasTenants.extraPropertiesPlaceholder')}
          autoCapitalize="none"
          multiline
          fieldError={fieldError}
        />
        <AppFormSubmit
          error={submitError}
          title={t('common.save')}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
