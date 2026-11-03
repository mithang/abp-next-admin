import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppEmptyState } from '../../../components/ui/AppStates';
import { AppSectionCard } from '../../../components/ui/AppSectionCard';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { listRefreshProps } from '../../../lib/list-refresh';
import { keyByName } from '../../../lib/list-keys';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  checkTenantConnectionString,
  deleteTenantConnectionString,
  getTenant,
  getTenantConnectionStrings,
  setTenantConnectionString,
} from '../../../features/saas/saas-api';
import {
  connectionStringCheckFormDefaults,
  connectionStringCheckFormSchema,
  connectionStringSetFormDefaults,
  connectionStringSetFormSchema,
  type ConnectionStringCheckFormValues,
  type ConnectionStringSetFormValues,
} from '../../../features/saas/connection-string-form-schema';
import type { TenantConnectionStringDto } from '../../../features/saas/types';
import { useSubmitError } from '../../../lib/use-submit-error';
import { createFieldError } from '../../../lib/field-error';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateQueries } from '../../../lib/mutation-success';

/**
 * Quản lý chuỗi kết nối của tenant, đúng modal ConnectionStrings của web:
 * - Danh sách GET .../connection-string (ListResult).
 * - Đặt: PUT .../connection-string { name, value } (tạo mới hoặc ghi đè).
 * - Xóa: DELETE .../connection-string/{name} có xác nhận.
 * - Kiểm tra: POST /api/saas/tenants/connection-string/check — trả void,
 *   thành công = kết nối được, lỗi = không kết nối được.
 * BẢO MẬT: giá trị đã lưu KHÔNG render lên UI; form nhập dùng input mật
 * khẩu; không log giá trị.
 */
export default function TenantConnectionStringsScreen() {
  const { t } = useTranslation();
  const { tenantId } = useRouteParams<{ tenantId: string }>();
  const invalidate = useInvalidateQueries(['saas-tenant-connection-strings', tenantId]);
  const { error: setError, onError: handleSetError, clearError: clearSetError } = useSubmitError();
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const {
    error: checkError,
    onError: handleCheckError,
    clearError: clearCheckError,
  } = useSubmitError();

  const tenantQuery = useDetailQuery('saas-tenants', tenantId, getTenant);
  const listQuery = useDetailQuery(
    'saas-tenant-connection-strings',
    tenantId,
    getTenantConnectionStrings,
  );

  const setForm = useForm<ConnectionStringSetFormValues>({
    resolver: zodResolver(connectionStringSetFormSchema),
    defaultValues: connectionStringSetFormDefaults,
  });
  const checkForm = useForm<ConnectionStringCheckFormValues>({
    resolver: zodResolver(connectionStringCheckFormSchema),
    defaultValues: connectionStringCheckFormDefaults,
  });

  const setMutation = useMutation({
    mutationFn: (values: ConnectionStringSetFormValues) =>
      setTenantConnectionString(tenantId, { name: values.name.trim(), value: values.value }),
    onSuccess: async () => {
      clearSetError();
      setForm.reset();
      await invalidate();
    },
    onError: handleSetError,
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteTenantConnectionString(tenantId, name),
    onSuccess: invalidate,
  });

  const checkMutation = useMutation({
    mutationFn: (values: ConnectionStringCheckFormValues) =>
      checkTenantConnectionString({
        provider: values.provider.trim(),
        name: values.name?.trim() || undefined,
        connectionString: values.connectionString,
      }),
    onSuccess: () => {
      clearCheckError();
      setCheckResult(t('saasConnectionStrings.connected'));
    },
    onError: (error) => {
      setCheckResult(null);
      handleCheckError(error);
    },
  });

  const queryState = queryStateElement([tenantQuery, listQuery]);
  if (queryState) return queryState;

  const fieldError = createFieldError(t, 'saasConnectionStrings');
  const items = listQuery.data?.items ?? [];

  const renderRow = ({ item }: { item: TenantConnectionStringDto }) => (
    <AppSectionCard>
      <Text>{item.name}</Text>
      <Text>{t('saasConnectionStrings.valueHidden')}</Text>
      <Pressable
        onPress={() =>
          showConfirmDialog({
            title: t('saasConnectionStrings.deleteConfirmTitle'),
            message: t('saasConnectionStrings.deleteConfirmMessage'),
            confirmText: t('common.delete'),
            cancelText: t('common.cancel'),
            onConfirm: () => deleteMutation.mutate(item.name),
          })
        }
      >
        <Text>{t('common.delete')}</Text>
      </Pressable>
    </AppSectionCard>
  );

  return (
    <AppScreen title={t('saasConnectionStrings.title')} subtitle={tenantQuery.data?.name ?? ''}>
      <VStack space="sm">
        {items.length === 0 ? (
          <AppEmptyState message={t('saasConnectionStrings.empty')} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={keyByName}
            renderItem={renderRow}
            {...listRefreshProps(listQuery)}
          />
        )}
        <Text>{t('saasConnectionStrings.setTitle')}</Text>
        <AppFormInput
          control={setForm.control}
          name="name"
          label={t('saasConnectionStrings.name')}
          placeholder={t('saasConnectionStrings.namePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={setForm.control}
          name="value"
          label={t('saasConnectionStrings.value')}
          placeholder={t('saasConnectionStrings.valuePlaceholder')}
          autoCapitalize="none"
          secureTextEntry
          fieldError={fieldError}
        />
        {stateErrorElement(setError)}
        <AppButton
          title={t('common.save')}
          loading={setMutation.isPending}
          disabled={setMutation.isPending}
          onPress={() => void setForm.handleSubmit((values) => setMutation.mutate(values))()}
        />
        <Text>{t('saasConnectionStrings.checkTitle')}</Text>
        <AppFormInput
          control={checkForm.control}
          name="provider"
          label={t('saasConnectionStrings.provider')}
          placeholder={t('saasConnectionStrings.providerPlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={checkForm.control}
          name="name"
          label={t('saasConnectionStrings.name')}
          placeholder={t('saasConnectionStrings.namePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={checkForm.control}
          name="connectionString"
          label={t('saasConnectionStrings.connectionString')}
          placeholder={t('saasConnectionStrings.connectionStringPlaceholder')}
          autoCapitalize="none"
          secureTextEntry
          fieldError={fieldError}
        />
        {checkResult ? <Text>{checkResult}</Text> : null}
        {stateErrorElement(checkError)}
        <AppButton
          title={t('saasConnectionStrings.check')}
          loading={checkMutation.isPending}
          disabled={checkMutation.isPending}
          onPress={() => void checkForm.handleSubmit((values) => checkMutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}
