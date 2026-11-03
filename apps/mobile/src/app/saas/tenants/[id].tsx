import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteTenant, getTenant } from '../../../features/saas/saas-api';

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
  const query = useQuery({
    queryKey: ['saas-tenants', id],
    queryFn: () => getTenant(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name} subtitle={item.normalizedName}>
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
        <AppNavButton
          title={t('saasTenants.editTitle')}
          href={`/saas/tenants/form?id=${encodeURIComponent(item.id)}`}
          variant="outline"
        />
        <AppNavButton
          title={t('saasTenants.connectionStrings')}
          href={`/saas/tenants/connection-strings?tenantId=${encodeURIComponent(item.id)}`}
          variant="outline"
        />
        <AppNavButton
          title={t('saasTenants.features')}
          href={`/saas/tenants/features?tenantId=${encodeURIComponent(item.id)}&tenantName=${encodeURIComponent(item.name)}`}
          variant="outline"
        />
        <AppNavButton
          title={t('saasTenants.impersonate')}
          href={`/saas/tenants/impersonate?tenantId=${encodeURIComponent(item.id)}&tenantName=${encodeURIComponent(item.name)}`}
          variant="outline"
          testID="saas-tenant-impersonate"
        />
        <AppDeleteButton
          confirmTitle={t('saasTenants.deleteConfirmTitle')}
          confirmMessage={t('saasTenants.deleteConfirmMessage')}
          onDelete={() => deleteTenant(id)}
          invalidateKey={['saas-tenants']}
          testID="saas-tenant-delete"
        />
      </VStack>
    </AppScreen>
  );
}
