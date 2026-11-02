import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteTenant, getTenant } from '../../../features/saas/saas-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

/**
 * Chi tiết tenant. Nút "Chuỗi kết nối" mở màn quản lý connection string
 * (đặt/xóa/kiểm tra) — đúng modal ConnectionStrings của web; giá trị
 * connection string đã lưu KHÔNG hiển thị (credential). Nút "Tính năng"
 * mở màn giá trị tính năng theo tenant (vòng 24, đúng FeatureModal web
 * với providerName 'T'). Nút "Mạo danh tenant" (vòng 25) mở màn nhập
 * tài khoản trong tenant, đúng modal Impersonation của web.
 */
export default function TenantDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['saas-tenants', id],
    queryFn: () => getTenant(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteTenant(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['saas-tenants'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.name} subtitle={item.normalizedName}>
      <VStack space="sm">
        <Text>
          {t('saasTenants.isActive')}:{' '}
          {item.isActive ? t('saasTenants.active') : t('saasTenants.inactive')}
        </Text>
        {item.editionName ? (
          <Text>
            {t('saasTenants.edition')}: {item.editionName}
          </Text>
        ) : null}
        {item.enableTime ? (
          <Text>
            {t('saasTenants.enableTime')}: {item.enableTime}
          </Text>
        ) : null}
        {item.disableTime ? (
          <Text>
            {t('saasTenants.disableTime')}: {item.disableTime}
          </Text>
        ) : null}
        {item.creationTime ? (
          <Text>
            {t('saasTenants.creationTime')}: {item.creationTime}
          </Text>
        ) : null}
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <Text>
            {t('saasTenants.extraProperties')}: {JSON.stringify(item.extraProperties)}
          </Text>
        ) : null}
        <AppButton
          title={t('saasTenants.editTitle')}
          onPress={() => router.push(`/saas/tenants/form?id=${encodeURIComponent(item.id)}`)}
          variant="outline"
        />
        <AppButton
          title={t('saasTenants.connectionStrings')}
          onPress={() =>
            router.push(`/saas/tenants/connection-strings?tenantId=${encodeURIComponent(item.id)}`)
          }
          variant="outline"
        />
        <AppButton
          title={t('saasTenants.features')}
          onPress={() =>
            router.push(
              `/saas/tenants/features?tenantId=${encodeURIComponent(item.id)}&tenantName=${encodeURIComponent(item.name)}`,
            )
          }
          variant="outline"
        />
        <AppButton
          title={t('saasTenants.impersonate')}
          onPress={() =>
            router.push(
              `/saas/tenants/impersonate?tenantId=${encodeURIComponent(item.id)}&tenantName=${encodeURIComponent(item.name)}`,
            )
          }
          variant="outline"
          testID="saas-tenant-impersonate"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('saasTenants.deleteConfirmTitle'),
              message: t('saasTenants.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="saas-tenant-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
