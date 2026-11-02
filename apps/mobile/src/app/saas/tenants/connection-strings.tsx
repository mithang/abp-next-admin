import { useState } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
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
import { toApiError } from '../../../lib/errors';

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
  const { tenantId } = useLocalSearchParams<{ tenantId: string }>();
  const queryClient = useQueryClient();
  const [setError, setSetError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const tenantQuery = useQuery({
    queryKey: ['saas-tenants', tenantId],
    queryFn: () => getTenant(tenantId),
    enabled: Boolean(tenantId),
  });
  const listQuery = useQuery({
    queryKey: ['saas-tenant-connection-strings', tenantId],
    queryFn: () => getTenantConnectionStrings(tenantId),
    enabled: Boolean(tenantId),
  });

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
      setSetError(null);
      setForm.reset();
      await queryClient.invalidateQueries({
        queryKey: ['saas-tenant-connection-strings', tenantId],
      });
    },
    onError: (error) => setSetError(toApiError(error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteTenantConnectionString(tenantId, name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['saas-tenant-connection-strings', tenantId],
      });
    },
  });

  const checkMutation = useMutation({
    mutationFn: (values: ConnectionStringCheckFormValues) =>
      checkTenantConnectionString({
        provider: values.provider.trim(),
        name: values.name?.trim() || undefined,
        connectionString: values.connectionString,
      }),
    onSuccess: () => {
      setCheckError(null);
      setCheckResult(t('saasConnectionStrings.connected'));
    },
    onError: (error) => {
      setCheckResult(null);
      setCheckError(toApiError(error).message);
    },
  });

  if (tenantQuery.isPending || listQuery.isPending) return <AppLoading />;
  if (tenantQuery.isError) {
    return (
      <AppErrorState
        message={toApiError(tenantQuery.error).message}
        onRetry={() => void tenantQuery.refetch()}
      />
    );
  }
  if (listQuery.isError) {
    return (
      <AppErrorState
        message={toApiError(listQuery.error).message}
        onRetry={() => void listQuery.refetch()}
      />
    );
  }

  const fieldError = (message?: string) =>
    message && message.startsWith('saasConnectionStrings.') ? t(message) : message;
  const items = listQuery.data?.items ?? [];

  const renderRow = ({ item }: { item: TenantConnectionStringDto }) => (
    <Card className="p-4">
      <VStack space="xs">
        <Text>{item.name}</Text>
        <Text>{t('saasConnectionStrings.valueHidden')}</Text>
        <Pressable
          onPress={() =>
            Alert.alert(
              t('saasConnectionStrings.deleteConfirmTitle'),
              t('saasConnectionStrings.deleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteMutation.mutate(item.name),
                },
              ],
            )
          }
        >
          <Text>{t('common.delete')}</Text>
        </Pressable>
      </VStack>
    </Card>
  );

  return (
    <AppScreen title={t('saasConnectionStrings.title')} subtitle={tenantQuery.data?.name ?? ''}>
      <VStack space="sm">
        {items.length === 0 ? (
          <AppEmptyState message={t('saasConnectionStrings.empty')} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.name}
            renderItem={renderRow}
            refreshing={listQuery.isFetching}
            onRefresh={() => void listQuery.refetch()}
          />
        )}
        <Text>{t('saasConnectionStrings.setTitle')}</Text>
        <Controller
          control={setForm.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasConnectionStrings.name')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('saasConnectionStrings.namePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={setForm.control}
          name="value"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasConnectionStrings.value')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('saasConnectionStrings.valuePlaceholder')}
              autoCapitalize="none"
              secureTextEntry
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        {setError ? <Text>{setError}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={setMutation.isPending}
          disabled={setMutation.isPending}
          onPress={() => void setForm.handleSubmit((values) => setMutation.mutate(values))()}
        />
        <Text>{t('saasConnectionStrings.checkTitle')}</Text>
        <Controller
          control={checkForm.control}
          name="provider"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasConnectionStrings.provider')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('saasConnectionStrings.providerPlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={checkForm.control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasConnectionStrings.name')}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('saasConnectionStrings.namePlaceholder')}
              autoCapitalize="none"
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={checkForm.control}
          name="connectionString"
          render={({ field, fieldState }) => (
            <AppInput
              label={t('saasConnectionStrings.connectionString')}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('saasConnectionStrings.connectionStringPlaceholder')}
              autoCapitalize="none"
              secureTextEntry
              error={fieldError(fieldState.error?.message)}
            />
          )}
        />
        {checkResult ? <Text>{checkResult}</Text> : null}
        {checkError ? <Text>{checkError}</Text> : null}
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
