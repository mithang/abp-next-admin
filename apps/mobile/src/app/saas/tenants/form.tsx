import { useState } from 'react';
import { Switch, View } from 'react-native';
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
import { createTenant, getEditionsPaged, getTenant, updateTenant } from '../../../features/saas/saas-api';
import {
  parseExtraPropertiesJson,
  tenantFormDefaults,
  tenantFormSchema,
  type TenantFormValues,
} from '../../../features/saas/tenant-form-schema';
import { toApiError } from '../../../lib/errors';

/**
 * Form tạo/sửa tenant, đúng DTO C#:
 * - Tạo: name + adminEmailAddress/adminPassword bắt buộc, useSharedDatabase
 *   mặc định bật; tắt DB chung thì defaultConnectionString bắt buộc.
 * - Sửa: ẩn admin fields, gửi kèm concurrencyStamp lấy từ detail.
 * - editionId nhập Guid; danh sách edition load từ GET /api/saas/editions
 *   hiển thị làm gợi ý "tên — id" (chưa có AppSelect, theo mẫu gợi ý
 *   provider của các vòng trước).
 * - enableTime/disableTime nhập text ISO, schema chặn enable > disable.
 * Chuỗi kết nối có tên riêng (ngoài default) quản lý sau khi tạo ở màn
 * connection-strings, đúng API đặt/xóa của backend.
 */
export default function TenantFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({ queryKey: ['saas-tenants', id], queryFn: () => getTenant(id as string), enabled: isEdit });
  const editionsQuery = useQuery({ queryKey: ['saas-editions-hint'], queryFn: () => getEditionsPaged({ maxResultCount: 100 }) });

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
        return updateTenant(id as string, { ...shared, concurrencyStamp: detail.data?.concurrencyStamp ?? '' });
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['saas-tenants'] });
      router.back();
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  if (isEdit && detail.isPending) return <AppLoading />;
  if (isEdit && detail.isError) {
    return <AppErrorState message={toApiError(detail.error).message} onRetry={() => void detail.refetch()} />;
  }

  const fieldError = (message?: string) => (message && message.startsWith('saasTenants.') ? t(message) : message);
  const editionsHint =
    editionsQuery.data?.items.map((e) => `${e.displayName} — ${e.id}`).join('\n') ||
    t('saasTenants.editionsLoading');

  return (
    <AppScreen title={t(isEdit ? 'saasTenants.editTitle' : 'saasTenants.createTitle')}>
      <VStack space="sm">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasTenants.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('saasTenants.namePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <View>
              <Text>{t('saasTenants.isActive')}</Text>
              <Switch value={field.value} onValueChange={field.onChange} accessibilityRole="switch" />
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="editionId"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasTenants.edition')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('saasTenants.editionPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Text>{t('saasTenants.editionsHint')}: {editionsHint}</Text>
        <Controller
          control={form.control}
          name="enableTime"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasTenants.enableTime')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('saasTenants.dateTimePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="disableTime"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasTenants.disableTime')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('saasTenants.dateTimePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        {!isEdit ? (
          <>
            <Controller
              control={form.control}
              name="adminEmailAddress"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('saasTenants.adminEmailAddress')}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder={t('saasTenants.adminEmailPlaceholder')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={fieldError(fieldState.error?.message)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="adminPassword"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('saasTenants.adminPassword')}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder={t('saasTenants.adminPasswordPlaceholder')}
                  secureTextEntry
                  error={fieldError(fieldState.error?.message)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="useSharedDatabase"
              render={({ field }) => (
                <View>
                  <Text>{t('saasTenants.useSharedDatabase')}</Text>
                  <Switch value={field.value} onValueChange={field.onChange} accessibilityRole="switch" />
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="defaultConnectionString"
              render={({ field, fieldState }) => (
                <AppInput
                  label={t('saasTenants.defaultConnectionString')}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder={t('saasTenants.defaultConnectionStringPlaceholder')}
                  autoCapitalize="none"
                  secureTextEntry
                  error={fieldError(fieldState.error?.message)}
                />
              )}
            />
          </>
        ) : null}
        <Controller
          control={form.control}
          name="extraPropertiesJson"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasTenants.extraProperties')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('saasTenants.extraPropertiesPlaceholder')}
              autoCapitalize="none"
              multiline
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        {submitError ? <Text>{submitError}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          onPress={() => void form.handleSubmit((values) => mutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
